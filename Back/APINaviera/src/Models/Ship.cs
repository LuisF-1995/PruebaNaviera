using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace APINaviera.src.Models
{
    public class Ship
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string model { get; set; }
        public string? image { get; set; }
    }
}
