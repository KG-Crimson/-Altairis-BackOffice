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
    public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels()
    {
        return await _context.Hotels
                             .Include(h => h.RoomTypes)
                             .Include(h => h.Bookings)
                             .Include(h => h.Inventories)
                             .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Hotel>> GetHotel(int id)
    {
        var hotel = await _context.Hotels
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

        return NoContent();
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
