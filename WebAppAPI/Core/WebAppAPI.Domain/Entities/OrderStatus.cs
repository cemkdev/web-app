using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Domain.Entities
{
    public class OrderStatus
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Order> Orders { get; set; }
    }
}
