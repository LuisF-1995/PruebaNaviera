using System.ComponentModel.DataAnnotations;

namespace APINaviera.src.Models
{
    public class Ticket
    {
        [Key]
        public int id { get; set; }
        [Required]
        public int userId { get; set; }
        [Required]
        public int travelId { get; set; }
        [Required]
        [MaxLength(20)]
        public string ticket { get; set; }
        [Required]
        public bool returns { get; set; }
        [Required]
        [MaxLength(5)]
        public string seat { get; set; }
        [Required]
        public bool redeemed { get; set; }
    }
}
