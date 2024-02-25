using System.Net;

namespace APINaviera.src.DTO
{
    public class FetchInfoResponse<T>
    {
        public bool success { get; set; }
        public string message { get; set; }
        public HttpStatusCode httpCode { get; set; }
        public T? objectResponse { get; set; }
    }
}
