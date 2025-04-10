using System.Text.Json.Serialization;

namespace WebAppAPI.Application.DTOs.Facebook
{
    public class FacebookUserInfoResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("first_name")]
        public string FirstName { get; set; }

        [JsonPropertyName("last_name")]
        public string LastName { get; set; }

        [JsonPropertyName("name")]
        public string FullName { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }
    }
}
