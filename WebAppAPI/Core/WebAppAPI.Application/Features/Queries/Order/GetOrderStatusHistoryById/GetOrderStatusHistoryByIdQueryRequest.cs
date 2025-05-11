using MediatR;

namespace WebAppAPI.Application.Features.Queries.Order.GetOrderStatusHistoryById
{
    public class GetOrderStatusHistoryByIdQueryRequest : IRequest<GetOrderStatusHistoryByIdQueryResponse>
    {
        public string OrderId { get; set; }
    }
}
