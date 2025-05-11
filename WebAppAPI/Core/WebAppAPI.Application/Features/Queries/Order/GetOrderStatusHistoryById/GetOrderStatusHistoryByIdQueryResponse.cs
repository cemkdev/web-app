using WebAppAPI.Application.DTOs.Order;

namespace WebAppAPI.Application.Features.Queries.Order.GetOrderStatusHistoryById
{
    public class GetOrderStatusHistoryByIdQueryResponse
    {
        public int CurrentStatusId { get; set; }
        public List<StatusChangeEntry> History { get; set; }
    }
}
