using System.ComponentModel.DataAnnotations;

namespace APINaviera.src.Models
{
    public class Travel
    {
        [Key]
        public int id {  get; set; }
        public string? destination { get; set; }
        public int? shipId { get; set; }
        public DateTime? departureDateTime { get; set; }
        [Required]
        public double cost { get; set; }
        [Required]
        public int passengersLimit { get; set; }
        [Required]
        public int availableSeatsNumber { get; set; }
    }
}
