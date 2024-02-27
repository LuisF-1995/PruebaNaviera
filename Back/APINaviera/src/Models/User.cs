using System.ComponentModel.DataAnnotations;
using System.Net;

namespace APINaviera.src.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        public string? email { get; set; }
        public string? password { get; set; }
        [Required]
        public string documentNumber { get; set; }
        public string? phone { get; set; }
        public bool isRegistered { get; set; }
        [Required]
        public UserRoles role { get; set; }
    }

    public class UserLogin
    {
        [Required]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
        public string? documentNumber { get; set; }
        [Required]
        public UserRoles role { get; set; }
    }

    public class UserLoginResponse
    {
        public int id { get; set; }
        public UserRoles role { get; set; }
        public string token { get; set; }
        public bool success { get; set; }
        public string message { get; set; }
        public HttpStatusCode httpCode { get; set; }
    }
}
