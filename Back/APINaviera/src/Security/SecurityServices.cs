using APINaviera.src.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace APINaviera.src.Security
{
    public class SecurityServices
    {
        private readonly IConfiguration _configuration;
        public SecurityServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public string GenerateToken(UserLogin userLogin)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            long.TryParse(_configuration["Jwt:ExpirationTimeInHours"], out long tokenValidityTime);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(ClaimTypes.Email, userLogin.email),
                    new(ClaimTypes.Role, userLogin.role.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(tokenValidityTime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }

        public bool PasswordMatches(UserLogin userLogin, User existentUser)
        {
            bool authState = false;
            string hashedInputPassword = HashPassword(userLogin.password);

            if(hashedInputPassword == existentUser.password && userLogin.email == existentUser.email)
                authState = true;

            return authState;
        }
    }
}
