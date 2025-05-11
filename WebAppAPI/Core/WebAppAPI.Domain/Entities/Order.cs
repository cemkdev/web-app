using WebAppAPI.Domain.Entities.Common;
using WebAppAPI.Domain.Enums;

namespace WebAppAPI.Domain.Entities
{
    public class Order : BaseEntity
    {
        public string Description { get; set; }
        public string Address { get; set; }
        public string OrderCode { get; set; }

        public int StatusId { get; set; }
        public OrderStatus Status { get; set; }
        public Basket Basket { get; set; }
    }
}
