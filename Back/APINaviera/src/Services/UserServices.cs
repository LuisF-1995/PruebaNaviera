using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;

namespace APINaviera.src.Services
{
    public class UserServices
    {
        private readonly NavieraDbContext _dbContext;

        public UserServices(NavieraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User GetUserById(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(userFind => userFind.id == userId);
            return user;
        }

        public User GetUserByEmail(string userEmail)
        {
            var user = _dbContext.Users.FirstOrDefault(userFind => userFind.email == userEmail);
            return user;
        }

        public UserDTO ConvertUserToUserDTO(User user) {
            var userDto = new UserDTO {
                id = user.id,
                name = user.name,
                email = user.email,
                documentNumber = user.documentNumber,
                phone = user.phone,
                isRegistered = user.isRegistered,
                role = user.role
            };
            return userDto;
        }

        public List<UserDTO> ConverListUserToLisUserDTO(List<User> usersList) {
            var usersDtoList = usersList.Select(user =>  ConvertUserToUserDTO(user)).ToList();
            return usersDtoList;
        }

        public bool IsRegistered(string userEmail)
        {
            var user = _dbContext.Users.FirstOrDefault(userFind => userFind.email == userEmail);

            if (user == null)
            {
                return false;
            }

            return true;
        }
    }
}
