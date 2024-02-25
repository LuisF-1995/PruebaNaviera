using APINaviera.src.DbConnection;
using APINaviera.src.DTO;
using APINaviera.src.Models;
using System.Net;

namespace APINaviera.src.Services
{
    public class TravelServices
    {
        private readonly NavieraDbContext _dbContext;

        public TravelServices(NavieraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Travel GetTravelById(int travelId)
        {
            Travel travel = _dbContext.Travels.FirstOrDefault(travelFind => travelFind.id == travelId);
            return travel;
        }

        public int TravelAvailableSeatsNumber(int travelId)
        {
            int availableNumber = 0;
            Travel travel = GetTravelById(travelId);

            if (travel != null)
            {
                availableNumber = travel.availableSeatsNumber;
            }

            return availableNumber;
        }

        public int UpdateTravelAvailableSeatsNumber(int travelId, bool isCancel)
        {
            Travel travel = GetTravelById(travelId);

            if (travel != null)
            {
                int availableNumber = travel.availableSeatsNumber;

                if (isCancel && availableNumber < travel.passengersLimit)
                {
                    travel.availableSeatsNumber = availableNumber + 1;
                }
                else if (availableNumber > 0)
                {
                    travel.availableSeatsNumber = availableNumber - 1;
                }

                _dbContext.Travels.Update(travel);
                _dbContext.SaveChanges();

                return travel.availableSeatsNumber;
            }

            return -1;
        }

        public FetchInfoResponse<Travel> CreateTravel(Travel travel)
        {
            _dbContext.Travels.Add(travel);
            _dbContext.SaveChanges();

            var travelSaved = new FetchInfoResponse<Travel>
            {
                success = true,
                message = "Travel successfully registered",
                httpCode = HttpStatusCode.OK,
                objectResponse = travel
            };

            return travelSaved;
        }
    }
}
