using WebAppAPI.Domain.Entities.Common;
using WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Domain.Entities
{
    public class Rating : BaseEntity
    {
        public Guid ProductId { get; set; }

        public string UserId { get; set; }

        public float Value { get; set; }
        public Product Product { get; set; }
        public AppUser User { get; set; }
    }
}
