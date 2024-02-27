using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace APINaviera.src.Models
{
    public class Ship
    {
        [Key]
        public int id { get; set; }
        [Required]
        [MaxLength(30)]
        public string name { get; set; }
        [Required]
        [MaxLength(20)]
        public string model { get; set; }
        public byte[]? image { get; set; }
    }
}
