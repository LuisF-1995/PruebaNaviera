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
    public class TicketController : ControllerBase
    {
        private readonly NavieraDbContext _dbContext;
        private readonly TicketServices _ticketServices;
        private readonly TravelServices _travelServices;

        public TicketController(NavieraDbContext dbContext, TicketServices ticketServices, TravelServices travelServices)
        {
            _dbContext = dbContext;
            _ticketServices = ticketServices;
            _travelServices = travelServices;
        }

        [HttpGet]
        public IEnumerable<Ticket> GetAllTickets()
        {
            var ticketsList = _dbContext.Tickets.ToList();
            return ticketsList;
        }

        [HttpGet("{id}")]
        public IActionResult GetTicketById(int id)
        {
            var ticket = _dbContext.Tickets.FirstOrDefault(ticketFind => ticketFind.id == id);

            if (ticket == null)
            {
                var ticketNotFound = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "Ticket not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(ticketNotFound);
            }
            else
            {
                var ticketResponse = new FetchInfoResponse<Ticket>
                {
                    success = true,
                    message = "Ticket found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = ticket
                };
                return Ok(ticketResponse);
            }
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetTicketByUserId(int userId)
        {
            var ticket = _dbContext.Tickets.FirstOrDefault(ticketFind => ticketFind.userId == userId);

            if (ticket == null)
            {
                var ticketNotFound = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "Ticket not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(ticketNotFound);
            }
            else
            {
                var ticketResponse = new FetchInfoResponse<Ticket>
                {
                    success = true,
                    message = "Ticket found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = ticket
                };
                return Ok(ticketResponse);
            }
        }

        [AllowAnonymous]
        [HttpGet("reference")]
        public IActionResult GetTicketByUserId([FromQuery] string ticketRef)
        {
            var ticket = _dbContext.Tickets.FirstOrDefault(ticketFind => ticketFind.ticket == ticketRef);

            if (ticket == null)
            {
                var ticketNotFound = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "Ticket not found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(ticketNotFound);
            }
            else
            {
                var ticketResponse = new FetchInfoResponse<Ticket>
                {
                    success = true,
                    message = "Ticket found successfully",
                    httpCode = HttpStatusCode.OK,
                    objectResponse = ticket
                };
                return Ok(ticketResponse);
            }
        }

        [HttpPost]
        public IActionResult RegisterTicket([FromBody] Ticket ticketRegister)
        {
            if (!ModelState.IsValid)
            {
                var ticketBadRequest = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "The ticket sent does not meet the mimimal ticket requirements, the ticket structure contains: \n" +
                    "int userId\r\n" +
                    "int travelId\r\n" +
                    "string ticket\r\n" +
                    "boolean returns\r\n" +
                    "string seat\r\n" +
                    "bool redeemed",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(ticketBadRequest);
            }

            var travel = _travelServices.GetTravelById(ticketRegister.travelId);
            if (travel == null)
            {
                var travelNotFound = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "There is not any travel registered with that info",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(travelNotFound);
            }

            var ticket = _ticketServices.GetTicketByTicketReference(ticketRegister.ticket);
            if (ticket != null)
            {
                var ticketConflict = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "There is already a ticket with in use with this ticket reference",
                    httpCode = HttpStatusCode.Conflict,
                    objectResponse = null
                };
                return Conflict(ticketConflict);
            }

            FetchInfoResponse<Ticket> ticketSaved = _ticketServices.CreateTicket(ticketRegister);
            return Ok(ticketSaved);
        }

        [HttpPut]
        public IActionResult UpdateTicket([FromBody] Ticket ticketUpdate)
        {
            if (ticketUpdate.id == null || ticketUpdate.id == 0)
            {
                var ticketBadRequest = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "An 'id' is required to update the ticket",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(ticketBadRequest);
            }
            else if (!ModelState.IsValid)
            {
                var shipBadRequest = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "The ticket sent does not meet the mimimal ticket requirements, the ticket structure contains: \n" +
                    "int id" +
                    "int userId\r\n" +
                    "int travelId\r\n" +
                    "string ticket\r\n" +
                    "bool returns\r\n" +
                    "string seat\r\n" +
                    "bool redeemed",
                    httpCode = HttpStatusCode.BadRequest,
                    objectResponse = null
                };
                return BadRequest(shipBadRequest);
            }

            _dbContext.Tickets.Update(ticketUpdate);
            _dbContext.SaveChanges();

            var ticketResponse = new FetchInfoResponse<Ticket>
            {
                success = true,
                message = "Ticket updated successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = ticketUpdate
            };
            return Ok(ticketResponse);
        }

        [HttpPut("redeem/{ticketId}")]
        public IActionResult RedeemTicket(int ticketId)
        {
            Ticket ticketUpdate = _ticketServices.GetTicketById(ticketId);
            if (ticketUpdate == null)
            {
                var ticketNotFound = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "Ticket not  found",
                    httpCode = HttpStatusCode.NotFound,
                    objectResponse = null
                };
                return NotFound(ticketNotFound);
            }

            if (ticketUpdate.redeemed)
            {
                var ticketConflict = new FetchInfoResponse<Ticket>
                {
                    success = false,
                    message = "Ticket was already redeemed",
                    httpCode = HttpStatusCode.Conflict,
                    objectResponse = null
                };
                return Conflict(ticketConflict);
            }

            ticketUpdate.redeemed = true;
            _dbContext.Tickets.Update(ticketUpdate);
            _dbContext.SaveChanges();

            var ticketResponse = new FetchInfoResponse<Ticket>
            {
                success = true,
                message = "Ticket redeemed successfully",
                httpCode = HttpStatusCode.OK,
                objectResponse = ticketUpdate
            };
            return Ok(ticketResponse);
        }
    }
}
