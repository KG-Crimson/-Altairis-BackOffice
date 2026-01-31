using System;

namespace Altairis.Api.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string GuestName { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string Status { get; set; }

        public int HotelId { get; set; }
        public Hotel Hotel { get; set; }

        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; }
    }
}
