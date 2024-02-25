using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace APINaviera.src.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShipController : ControllerBase
    {
        private readonly NavieraDbContext _dbContext;

        public ShipController(NavieraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [AllowAnonymous]
        [HttpGet]
        public IEnumerable<Ship> GetAllShips()
        {
            var shipsList = _dbContext.Ships.ToList();
            return shipsList;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetShipById(int id)
        {
            var ship = _dbContext.Ships.FirstOrDefault(shipFind => shipFind.id == id);

            if (ship == null)
            {
                var shipNotFound = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "Ship not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(shipNotFound);
            }
            else
            {
                var shipResponse = new FetchInfoResponse<Ship>
                {
                    success = true,
                    message = "Ship found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = ship
                };
                return Ok(shipResponse);
            }
        }

        [AllowAnonymous]
        [HttpGet("{name}")]
        public IActionResult GetShipByName(string name)
        {
            var ship = _dbContext.Ships.FirstOrDefault(shipFind => shipFind.name == name);

            if (ship == null)
            {
                var shipNotFound = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "Ship not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(shipNotFound);
            }
            else
            {
                var shipResponse = new FetchInfoResponse<Ship>
                {
                    success = true,
                    message = "Ship found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = ship
                };
                return Ok(shipResponse);
            }
        }

        [HttpPost]
        public IActionResult RegisterShip([FromBody] Ship shipRegister)
        {
            if (!ModelState.IsValid)
            {
                var shipBadRequest = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "The ship sent does not meet the mimimal ship requirements, the ship structure contains: \n" +
                    "string name\r\n" +
                    "string model\r\n" +
                    "string? image",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(shipBadRequest);
            }

            var ship = _dbContext.Ships.FirstOrDefault(shipFind => shipFind.name == shipRegister.name);
            if (ship != null)
            {
                var shipConflict = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "There is already a ship with the same name",
                    httpCode = HttpStatusCode.Conflict,
                    objectResponse = null
                };
                return Conflict(shipConflict);
            }

            _dbContext.Ships.Add(shipRegister);
            _dbContext.SaveChanges();

            var shipSaved = new FetchInfoResponse<Ship>
            {
                success = true,
                message = "Ship successfully registered",
                httpCode = HttpStatusCode.OK,
                objectResponse = shipRegister
            };
            return Ok(shipSaved);
        }

        [HttpPut]
        public IActionResult UpdateShip([FromBody] Ship shipUpdate)
        {
            if (shipUpdate.id == null || shipUpdate.id == 0)
            {
                var shipBadRequest = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "An 'id' is required to update the ship",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(shipBadRequest);
            }
            else if (!ModelState.IsValid)
            {
                var shipBadRequest = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "The ship sent does not meet the mimimal ship requirements, the ship structure contains: \n" +
                    "int id\r\n" +
                    "string name\r\n" +
                    "string model\r\n" +
                    "string? image",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(shipBadRequest);
            }

            _dbContext.Ships.Update(shipUpdate);
            _dbContext.SaveChanges();

            var shipResponse = new FetchInfoResponse<Ship>
            {
                success = true,
                message = "User updated successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = shipUpdate
            };
            return Ok(shipResponse);
        }

        [HttpDelete]
        public IActionResult DeleteShip(int id)
        {
            var ship = _dbContext.Ships.FirstOrDefault(shipFind => shipFind.id == id);

            if (ship == null)
            {
                var shipNotFound = new FetchInfoResponse<Ship>
                {
                    success = false,
                    message = "Ship not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(shipNotFound);
            }

            _dbContext.Ships.Remove(ship);
            _dbContext.SaveChanges();
            var shipResponse = new FetchInfoResponse <Ship>
            {
                success = true,
                message = "Ship deleted successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = null
            };
            return Ok(shipResponse);
        }
    }
}
