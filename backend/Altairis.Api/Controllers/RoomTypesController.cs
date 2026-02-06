using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Altairis.Api.Data;
using Altairis.Api.Models;

namespace Altairis.Api.Controllers
{
    [Route("api/[controller]")]
 [ApiController]
  public class RoomTypesController : ControllerBase
 {
    private readonly AppDbContext _context;

    public RoomTypesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetRoomTypes([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Paginacion basica para listas grandes.
        var size = Math.Clamp(pageSize, 1, 200);
        var currentPage = Math.Max(page, 1);
        var total = await _context.RoomTypes.CountAsync();

        var items = await _context.RoomTypes
                                  .AsNoTracking()
                                  .Include(r => r.Hotel)
                                  .OrderBy(r => r.Id)
                                  .Skip((currentPage - 1) * size)
                                  .Take(size)
                                  .ToListAsync();

        return Ok(new { items, total, page = currentPage, pageSize = size });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        var roomType = await _context.RoomTypes
                                     .AsNoTracking()
                                     .Include(r => r.Hotel)
                                     .FirstOrDefaultAsync(r => r.Id == id);
        if (roomType == null) return NotFound();
        return roomType;
    }

    [HttpPost]
    public async Task<ActionResult<RoomType>> CreateRoomType(RoomType roomType)
    {
        // Valida que el hotel exista antes de crear.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == roomType.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        _context.RoomTypes.Add(roomType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoomType), new { id = roomType.Id }, roomType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoomType(int id, RoomType roomType)
    {
        if (id != roomType.Id) return BadRequest();

        // Evita RoomTypes sin hotel valido.
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == roomType.HotelId);
        if (!hotelExists)
        {
            return BadRequest("HotelId no existe.");
        }

        _context.Entry(roomType).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.RoomTypes.Any(r => r.Id == id)) return NotFound();
            else throw;
        }
        var updated = await _context.RoomTypes
                                    .AsNoTracking()
                                    .Include(r => r.Hotel)
                                    .FirstOrDefaultAsync(r => r.Id == id);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoomType(int id)
    {
        var roomType = await _context.RoomTypes.FindAsync(id);
        if (roomType == null) return NotFound();

        _context.RoomTypes.Remove(roomType);
        await _context.SaveChangesAsync();
        return NoContent();
    }
 }
}
