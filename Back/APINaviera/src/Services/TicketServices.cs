using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;
using System.Net;

namespace APINaviera.src.Services
{
    public class TicketServices
    {
        private readonly NavieraDbContext _dbContext;
        private readonly TravelServices _travelServices;

        public TicketServices(NavieraDbContext dbContext, TravelServices travelServices)
        {
            _dbContext = dbContext;
            _travelServices = travelServices;
        }

        public Ticket GetTicketById(int ticketId)
        {
            var ticket = _dbContext.Tickets.FirstOrDefault(ticketFind => ticketFind.id == ticketId);
            return ticket;
        }

        public Ticket GetTicketByTicketReference(string ticketRef)
        {
            var ticket = _dbContext.Tickets.FirstOrDefault(ticketFind => ticketFind.ticket == ticketRef);
            return ticket;
        }

        public FetchInfoResponse<Ticket> CreateTicket(Ticket ticket)
        {
            string stringUserId = ticket.userId.ToString();
            string stringTravelId = ticket.travelId.ToString();
            string actualDate = DateTime.Now.ToString();
            string departuraDateTime = _travelServices.GetTravelById(ticket.travelId).departureDateTime.ToString();
            string ticketRef = stringUserId.Substring(0,1) + stringTravelId.Substring(0,1) + actualDate.Substring(0,9) + departuraDateTime.Substring(0,9);
            ticket.ticket = ticketRef;

            _dbContext.Tickets.Add(ticket);
            _dbContext.SaveChanges();
            _travelServices.UpdateTravelAvailableSeatsNumber(ticket.travelId, false);

            var ticketSaved = new FetchInfoResponse<Ticket>
            {
                success = true,
                message = "Ticket successfully registered",
                httpCode = HttpStatusCode.OK,
                objectResponse = ticket
            };

            return ticketSaved;
        }
    }
}
