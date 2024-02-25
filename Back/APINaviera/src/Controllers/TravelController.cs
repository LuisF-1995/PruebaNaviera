using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;
using APINaviera.src.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace APINaviera.src.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly NavieraDbContext _dbContext;
        private readonly TicketServices _ticketServices;
        private readonly TravelServices _travelServices;

        public TravelController(NavieraDbContext dbContext, TicketServices ticketServices, TravelServices travelServices)
        {
            _dbContext = dbContext;
            _ticketServices = ticketServices;
            _travelServices = travelServices;
        }

        [AllowAnonymous]
        [HttpGet]
        public IEnumerable<Travel> GetAllTravels()
        {
            var travelsList = _dbContext.Travels.ToList();
            return travelsList;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetTravelById(int id)
        {
            var travel = _travelServices.GetTravelById(id);

            if (travel == null)
            {
                var travelNotFound = new FetchInfoResponse<Travel>
                {
                    success = false,
                    message = "Travel not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(travelNotFound);
            }
            else
            {
                var travelResponse = new FetchInfoResponse<Travel>
                {
                    success = true,
                    message = "Travel found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = travel
                };
                return Ok(travelResponse);
            }
        }

        [HttpPost]
        public IActionResult RegisterTravel([FromBody] Travel travelRegister)
        {
            if (!ModelState.IsValid)
            {
                var travelBadRequest = new FetchInfoResponse<Travel>
                {
                    success = false,
                    message = "The travel sent does not meet the mimimal travel requirements, the travel structure contains: \n" +
                    "string? destination\r\n" +
                    "int? shipId" +
                    "DateTime? departureDateTime\r\n" +
                    "bool cost\r\n" +
                    "int passengersLimit\r\n" +
                    "int availableSeatsNumber",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(travelBadRequest);
            }

            travelRegister.availableSeatsNumber = travelRegister.passengersLimit;

            FetchInfoResponse<Travel> travelSaved = _travelServices.CreateTravel(travelRegister);
            return Ok(travelSaved);
        }

        [HttpPut]
        public IActionResult UpdateTravel([FromBody] Travel travelUpdate)
        {
            if (travelUpdate.id == null || travelUpdate.id == 0)
            {
                var travelBadRequest = new FetchInfoResponse<Travel>
                {
                    success = false,
                    message = "An 'id' is required to update the travel",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(travelBadRequest);
            }
            else if (!ModelState.IsValid)
            {
                var travelBadRequest = new FetchInfoResponse<Travel>
                {
                    success = false,
                    message = "The travel sent does not meet the mimimal travel requirements, the travel structure contains: \n" +
                    "int id" +
                    "string? destination\r\n" +
                    "int? shipId" +
                    "DateTime? departureDateTime\r\n" +
                    "bool cost\r\n" +
                    "int passengersLimit\r\n" +
                    "int availableSeatsNumber",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(travelBadRequest);
            }

            _dbContext.Travels.Update(travelUpdate);
            _dbContext.SaveChanges();

            var travelResponse = new FetchInfoResponse<Travel>
            {
                success = true,
                message = "Travel updated successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = travelUpdate
            };
            return Ok(travelResponse);
        }
    }
}
