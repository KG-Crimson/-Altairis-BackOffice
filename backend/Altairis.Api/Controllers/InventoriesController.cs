using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Altairis.Api.Data;
using Altairis.Api.Models;

namespace Altairis.Api.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class InventoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InventoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetInventories([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Paginacion basica para listas grandes.
        var size = Math.Clamp(pageSize, 1, 200);
        var currentPage = Math.Max(page, 1);
        var total = await _context.Inventories.CountAsync();

        var items = await _context.Inventories
                                  .AsNoTracking()
                                  .Include(i => i.Hotel)
                                  .Include(i => i.RoomType)
                                  .OrderBy(i => i.Id)
                                  .Skip((currentPage - 1) * size)
                                  .Take(size)
                                  .ToListAsync();

        return Ok(new { items, total, page = currentPage, pageSize = size });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Inventory>> GetInventory(int id)
    {
        var inventory = await _context.Inventories
                                      .AsNoTracking()
                                      .Include(i => i.Hotel)
                                      .Include(i => i.RoomType)
                                      .FirstOrDefaultAsync(i => i.Id == id);
        if (inventory == null) return NotFound();
        return inventory;
    }

    [HttpPost]
    public async Task<ActionResult<Inventory>> CreateInventory(Inventory inventory)
    {
        // Validaciones de negocio basicas.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == inventory.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        var roomType = await _context.RoomTypes
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(r => r.Id == inventory.RoomTypeId);
        if (roomType == null)
        {
            return BadRequest("RoomTypeId no existe.");
        }

        if (roomType.HotelId != inventory.HotelId)
        {
            return BadRequest("RoomTypeId no pertenece al HotelId.");
        }

        _context.Inventories.Add(inventory);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInventory), new { id = inventory.Id }, inventory);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInventory(int id, Inventory inventory)
    {
        if (id != inventory.Id) return BadRequest();

        // Revalida relaciones para evitar inconsistencias.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == inventory.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        var roomType = await _context.RoomTypes
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(r => r.Id == inventory.RoomTypeId);
        if (roomType == null)
        {
            return BadRequest("RoomTypeId no existe.");
        }

        if (roomType.HotelId != inventory.HotelId)
        {
            return BadRequest("RoomTypeId no pertenece al HotelId.");
        }

        _context.Entry(inventory).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Inventories.Any(i => i.Id == id)) return NotFound();
            else throw;
        }
        var updated = await _context.Inventories
                                    .AsNoTracking()
                                    .Include(i => i.Hotel)
                                    .Include(i => i.RoomType)
                                    .FirstOrDefaultAsync(i => i.Id == id);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInventory(int id)
    {
        var inventory = await _context.Inventories.FindAsync(id);
        if (inventory == null) return NotFound();

        _context.Inventories.Remove(inventory);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
}
