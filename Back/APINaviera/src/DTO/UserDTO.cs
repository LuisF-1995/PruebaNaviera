using APINaviera.src.Models;
using System.ComponentModel.DataAnnotations;

namespace APINaviera.src.DTO
{
    public class UserDTO
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? email { get; set; }
        public string documentNumber { get; set; }
        public string? phone { get; set; }
        public bool isRegistered { get; set; }
        public UserRoles role { get; set; }
    }
}
