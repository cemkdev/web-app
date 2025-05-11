namespace WebAppAPI.Application.DTOs.Order
{
    public class OrderStatusHistoryDto
    {
        public int CurrentStatusId { get; set; }
        public List<StatusChangeEntry> History { get; set; }
    }
}
