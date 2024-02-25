using System.Net;

namespace APINaviera.src.DTO
{
    public class FetchUserInfoResponse
    {
        public bool success {  get; set; }
        public string message { get; set; }
        public HttpStatusCode httpCode { get; set; }
        public UserDTO? user { get; set; }
    }
}
