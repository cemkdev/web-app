using Microsoft.AspNetCore.Identity;

namespace WebAppAPI.Domain.Entities.Identity
{
    public class AppUser : IdentityUser<string>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenEndDate { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<Basket> Baskets { get; set; }
    }
}
