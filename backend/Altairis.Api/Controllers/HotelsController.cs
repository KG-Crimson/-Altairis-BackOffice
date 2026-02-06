using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Altairis.Api.Data;
using Altairis.Api.Models;

namespace Altairis.Api.Controllers
{
    [Route("api/[controller]")]
 [ApiController]
 public class HotelsController : ControllerBase
 {
    private readonly AppDbContext _context;

    public HotelsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetHotels([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Paginacion basica para listas grandes.
        var size = Math.Clamp(pageSize, 1, 200);
        var currentPage = Math.Max(page, 1);
        var total = await _context.Hotels.CountAsync();

        var items = await _context.Hotels
                                  .AsNoTracking()
                                  .Include(h => h.RoomTypes)
                                  .Include(h => h.Bookings)
                                  .Include(h => h.Inventories)
                                  .OrderBy(h => h.Id)
                                  .Skip((currentPage - 1) * size)
                                  .Take(size)
                                  .ToListAsync();

        return Ok(new { items, total, page = currentPage, pageSize = size });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Hotel>> GetHotel(int id)
    {
        var hotel = await _context.Hotels
                                  .AsNoTracking()
                                  .Include(h => h.RoomTypes)
                                  .Include(h => h.Bookings)
                                  .Include(h => h.Inventories)
                                  .FirstOrDefaultAsync(h => h.Id == id);

        if (hotel == null)
            return NotFound();

        return hotel;
    }

    [HttpPost]
    public async Task<ActionResult<Hotel>> CreateHotel(Hotel hotel)
    {
        _context.Hotels.Add(hotel);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id }, hotel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, Hotel hotel)
    {
        if (id != hotel.Id) return BadRequest();
        _context.Entry(hotel).State = EntityState.Modified;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Hotels.Any(h => h.Id == id)) return NotFound();
            else throw;
        }

        var updated = await _context.Hotels
                                    .AsNoTracking()
                                    .Include(h => h.RoomTypes)
                                    .Include(h => h.Bookings)
                                    .Include(h => h.Inventories)
                                    .FirstOrDefaultAsync(h => h.Id == id);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null) return NotFound();

        _context.Hotels.Remove(hotel);
        await _context.SaveChangesAsync();
        return NoContent();
    }
 }

}
