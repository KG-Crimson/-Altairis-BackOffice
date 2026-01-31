using System;

namespace Altairis.Api.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int AvailableRooms { get; set; }

        public int HotelId { get; set; }
        public Hotel Hotel { get; set; }

        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; }
    }
}
