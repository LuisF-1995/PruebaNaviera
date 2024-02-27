using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;
using APINaviera.src.Security;
using APINaviera.src.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;


namespace APINaviera.src.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly NavieraDbContext _dbContext;
        private UserServices _userServices;
        private readonly SecurityServices _securityServices;

        public UserController(IConfiguration configuration, NavieraDbContext dbContext, UserServices userServices, SecurityServices securityServices)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _userServices = userServices;
            _securityServices = securityServices;
        }

        [HttpGet]
        public IEnumerable<UserDTO> GetAllUsers()
        {
            var usersList = _dbContext.Users.ToList();
            var usersDtoList = _userServices.ConverListUserToLisUserDTO(usersList);
            return usersDtoList;
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _dbContext.Users.FirstOrDefault(userFind => userFind.id == id);

            if (user == null)
            {
                var userResponse = new FetchInfoResponse<UserDTO>
                {
                    success = false,
                    message = "User not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(userResponse);
            }
            else
            {
                var userResponse = new FetchInfoResponse<UserDTO>
                {
                    success = true,
                    message = "User found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = _userServices.ConvertUserToUserDTO(user)
                };
                return Ok(userResponse);
            }
        }

        [AllowAnonymous]
        [HttpGet("roles-string")]
        public IEnumerable<string> GetRolesString()
        {
            var userRoles = Enum.GetValues(typeof(UserRoles)).Cast<UserRoles>().Select(role => role.ToString());
            return userRoles;
        }

        [AllowAnonymous]
        [HttpGet("roles")]
        public IEnumerable<UserRoles> GetRoles()
        {
            var userRoles = Enum.GetValues(typeof(UserRoles)).Cast<UserRoles>();
            return userRoles;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] User userRegister)
        {
            if (!ModelState.IsValid)
            {
                var userResponseBad = new FetchInfoResponse<User>
                {
                    success = false,
                    message = "The user sent does not meet the mimimal user requirements, the user structure contains: \n" +
                    "string name \r\n" +
                    "string? email \r\n" +
                    "string? password \r\n" +
                    "string documentNumber \r\n" +
                    "string? phone \r\n" +
                    "bool isRegistered \r\n" +
                    "UserRoles role ",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(userResponseBad);
            }

            if (userRegister.email == null || userRegister.email.Length == 0)
            {
                var userResponseBad = new FetchInfoResponse<User>
                {
                    success = false,
                    message = "The 'email' is missing from the minimum required info",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(userResponseBad);
            }

            User userExistent = _userServices.GetUserByEmail(userRegister.email);
            if (userExistent != null)
            {
                if (!userExistent.isRegistered)
                {
                    var userResponseNotRegistered = new FetchInfoResponse<User>
                    {
                        success = true,
                        message = "El correo ingresado para el usuario ya existe",
                        httpCode = HttpStatusCode.OK,
                        objectResponse = userExistent
                    };
                    return Ok(userResponseNotRegistered);
                }

                var userResponseExistent = new FetchInfoResponse<User>
                {
                    success = false,
                    message = "El correo ingresado para el usuario ya existe",
                    httpCode = HttpStatusCode.Conflict,
                    objectResponse = null
                };
                return Conflict(userResponseExistent);
            }

            if(userRegister.password == null)
            {
                var userResponseBad = new FetchInfoResponse<User>
                {
                    success = false,
                    message = "The 'password' is missing from the minimum required info",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(userResponseBad);
            }

            string passwordHash = _securityServices.HashPassword(userRegister.password);
            userRegister.password = passwordHash;

            _dbContext.Users.Add(userRegister);
            _dbContext.SaveChanges();

            var userResponse = new FetchInfoResponse<UserDTO>
            {
                success = true,
                message = "User registered successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = _userServices.ConvertUserToUserDTO(userRegister)
            };
            return Ok(userResponse);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult LoginUser([FromBody] UserLogin userLogin)
        {
            if (!ModelState.IsValid)
            {
                var userResponseBad = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The user sent does not meet the mimimal user requirements, the user structure contains: \n" +
                    "string email \r\n" +
                    "string password \r\n" +
                    "string? documentNumber \r\n" +
                    "UserRoles role ",
                    httpCode = HttpStatusCode.BadRequest,
                    user = null
                };
                return BadRequest(userResponseBad);
            }

            if (userLogin.email == null || userLogin.email.Length == 0)
            {
                var userResponseBad = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The 'email' is missing from the minimum required info",
                    httpCode = HttpStatusCode.BadRequest,
                    user = null
                };
                return BadRequest(userResponseBad);
            }

            User userFound = _dbContext.Users.FirstOrDefault(userFilter => userFilter.email == userLogin.email);

            if (userFound == null)
            {
                var userResponseNotFound = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The user is not registered yet",
                    httpCode = HttpStatusCode.NotFound,
                    user = null
                };
                return NotFound(userResponseNotFound);
            }

            if (userLogin.password == null)
            {
                var userResponseBad = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The 'password' is missing from the minimum required info",
                    httpCode = HttpStatusCode.BadRequest,
                    user = null
                };
                return BadRequest(userResponseBad);
            }
            else if (userFound != null && !_securityServices.PasswordMatches(userLogin, userFound))
            {
                var userResponseUnauthorized = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The password is not correct",
                    httpCode = HttpStatusCode.Unauthorized,
                    user = null
                };
                return Unauthorized(userResponseUnauthorized);
            }

            string jwtToken = _securityServices.GenerateToken(userLogin);

            var userLoginResponse = new UserLoginResponse
            {
                id = userFound.id,
                role = userFound.role,
                token = jwtToken,
                success = true,
                message = "Login successfull",
                httpCode = HttpStatusCode.OK
            };

            return Ok(userLoginResponse);
        }

        [HttpPut]
        public IActionResult UpdateUser([FromBody] User userUpdate)
        {
            if (userUpdate.id == null || userUpdate.id == 0)
            {
                var userResponseBad = new FetchUserInfoResponse
                {
                    success = false,
                    message = "An 'id' is required to update the user",
                    httpCode = HttpStatusCode.BadRequest,
                    user = null
                };
                return BadRequest(userResponseBad);
            }
            else if (!ModelState.IsValid)
            {
                var userResponseBad = new FetchUserInfoResponse
                {
                    success = false,
                    message = "The user sent does not meet the mimimal user requirements, the user structure contains: \n" +
                    "int id\r\n" +
                    "string name \r\n" +
                    "string? email \r\n" +
                    "string? password \r\n" +
                    "string documentNumber \r\n" +
                    "string? phone \r\n" +
                    "bool isRegistered \r\n" +
                    "UserRoles role ",
                    httpCode = HttpStatusCode.BadRequest,
                    user = null
                };
                return BadRequest(userResponseBad);
            }

            var userExistent = _dbContext.Users.AsNoTracking().FirstOrDefault(u => u.id == userUpdate.id);
            if(userUpdate.password == null)
            {
                userUpdate.password = userExistent.password;
            }
            else
            {
                string passwordHash = _securityServices.HashPassword(userUpdate.password);
                userUpdate.password = passwordHash;
            }

            _dbContext.Users.Update(userUpdate);
            _dbContext.SaveChanges();
            var userResponse = new FetchUserInfoResponse
            {
                success = true,
                message = "User updated successfully",
                httpCode = HttpStatusCode.OK,
                user = _userServices.ConvertUserToUserDTO(userUpdate)
            };
            return Ok(userResponse);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _dbContext.Users.FirstOrDefault(userFind => userFind.id == id);

            if (user == null)
            {
                var userResponse = new FetchUserInfoResponse
                {
                    success = false,
                    message = "User not found",
                    httpCode = HttpStatusCode.NotFound,
                    user = null
                };
                return NotFound(userResponse);
            }
            else
            {
                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();
                var userResponse = new FetchUserInfoResponse
                {
                    success = true,
                    message = "User deleted successfully",
                    httpCode = HttpStatusCode.OK,
                    user = null
                };
                return Ok(userResponse);
            }
        }
    }
}
