using WebAppAPI.Domain.Enums;

namespace WebAppAPI.Application.DTOs.Order
{
    public class UpdateOrderStatusMailDto
    {
        public string Recipient { get; set; }
        public string FirstName { get; set; }
        public string OrderCode { get; set; }
        public OrderStatusEnum NewStatus { get; set; }
        public DateTime StatusChangedDate { get; set; }
    }
}
