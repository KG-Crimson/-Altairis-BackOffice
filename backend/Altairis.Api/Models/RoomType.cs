namespace Altairis.Api.Models
{
    public class RoomType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }

        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }
}
