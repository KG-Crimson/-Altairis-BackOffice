using System.ComponentModel.DataAnnotations;

namespace Altairis.Api.Models
{
    public class RoomType
    {
        public int Id { get; set; }

        // Nombre y capacidad del tipo de habitacion.
        [Required]
        [StringLength(120)]
        public string Name { get; set; }

        [Range(1, 50)]
        public int Capacity { get; set; }

        [Range(1, int.MaxValue)]
        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }
}
