namespace WebAppAPI.Application.DTOs
{
    public class IdentityCheckDto
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public bool IsAuthenticated { get; set; }
        public DateTime Expiration { get; set; }
        public string RefreshBeforeTime { get; set; }
        public bool IsAdmin { get; set; }
    }
}
