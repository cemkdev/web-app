using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Domain.Entities
{
    public class Rating : BaseEntity
    {
        public Guid ProductId { get; set; }

        public Guid UserId { get; set; }

        public float Value { get; set; }
        public Product Product { get; set; }
    }
}
