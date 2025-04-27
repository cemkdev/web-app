using MediatR;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Queries.Order.GetAllOrders
{
    public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQueryRequest, GetAllOrdersQueryResponse>
    {
        readonly IOrderService _orderService;

        public GetAllOrdersQueryHandler(IOrderService orderService)
        {
            _orderService = orderService;
        }

        public async Task<GetAllOrdersQueryResponse> Handle(GetAllOrdersQueryRequest request, CancellationToken cancellationToken)
        {
            var order_list = await _orderService.GetAllOrdersAsync();

            var totalOrderCount = order_list.Count;
            var orders = order_list
                            .Skip(request.Page * request.Size).Take(request.Size)
                            .Select(o => new
                            {
                                o.Id,
                                o.OrderCode,
                                o.UserName,
                                o.TotalPrice,
                                o.DateCreated
                            }).ToList();

            return new()
            {
                Orders = orders,
                TotalOrderCount = totalOrderCount
            };
        }
    }
}
