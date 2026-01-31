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
    public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypes()
    {
        return await _context.RoomTypes
                             .Include(r => r.Hotel)
                             .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        var roomType = await _context.RoomTypes
                                     .Include(r => r.Hotel)
                                     .FirstOrDefaultAsync(r => r.Id == id);
        if (roomType == null) return NotFound();
        return roomType;
    }

    [HttpPost]
    public async Task<ActionResult<RoomType>> CreateRoomType(RoomType roomType)
    {
        _context.RoomTypes.Add(roomType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoomType), new { id = roomType.Id }, roomType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoomType(int id, RoomType roomType)
    {
        if (id != roomType.Id) return BadRequest();
        _context.Entry(roomType).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.RoomTypes.Any(r => r.Id == id)) return NotFound();
            else throw;
        }
        return NoContent();
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
