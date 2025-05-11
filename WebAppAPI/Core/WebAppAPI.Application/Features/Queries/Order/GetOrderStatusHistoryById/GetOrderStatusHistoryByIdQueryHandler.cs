using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Queries.Order.GetOrderStatusHistoryById
{
    public class GetOrderStatusHistoryByIdQueryHandler : IRequestHandler<GetOrderStatusHistoryByIdQueryRequest, GetOrderStatusHistoryByIdQueryResponse>
    {
        readonly IOrderService _orderService;

        public GetOrderStatusHistoryByIdQueryHandler(IOrderService orderService)
        {
            _orderService = orderService;
        }

        public async Task<GetOrderStatusHistoryByIdQueryResponse> Handle(GetOrderStatusHistoryByIdQueryRequest request, CancellationToken cancellationToken)
        {
            var orderStatusHistory = await _orderService.GetOrderStatusHistoryByIdAsync(request.OrderId);

            return new()
            {
                CurrentStatusId = orderStatusHistory.CurrentStatusId,
                History = orderStatusHistory.History
            };
        }
    }
}
