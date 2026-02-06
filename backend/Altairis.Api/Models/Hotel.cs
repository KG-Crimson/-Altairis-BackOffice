using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Altairis.Api.Models
{
    public class Hotel
    {
        public int Id { get; set; }

        // Datos basicos del hotel.
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(120)]
        public string City { get; set; }

        [Required]
        [StringLength(120)]
        public string Country { get; set; }

        // Relaciones de navegacion.
        public List<RoomType> RoomTypes { get; set; } = new();
        public List<Booking> Bookings { get; set; } = new();
        public List<Inventory> Inventories { get; set; } = new();
    }
}
