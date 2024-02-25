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
        public string ticket { get; set; }
        [Required]
        public Boolean returns { get; set; }
        [Required]
        public string seat { get; set; }
    }
}
