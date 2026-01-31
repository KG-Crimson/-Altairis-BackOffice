using System.Collections.Generic;

namespace Altairis.Api.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public List<RoomType> RoomTypes { get; set; } = new();
        public List<Booking> Bookings { get; set; } = new();
        public List<Inventory> Inventories { get; set; } = new();
    }
}
