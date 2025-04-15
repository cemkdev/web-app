using MediatR;
using WebAppAPI.Application.Abstractions.Hubs;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Commands.Order.CreateOrder
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommandRequest, CreateOrderCommandResponse>
    {
        readonly IOrderService _orderService;
        readonly IBasketService _basketService;
        readonly IOrderHubService _orderHubService;

        public CreateOrderCommandHandler(IOrderService orderService, IBasketService basketService, IOrderHubService orderHubService)
        {
            _orderService = orderService;
            _basketService = basketService;
            _orderHubService = orderHubService;
        }

        public async Task<CreateOrderCommandResponse> Handle(CreateOrderCommandRequest request, CancellationToken cancellationToken)
        {
            await _orderService.CreateOrderAsync(new()
            {
                BasketId = _basketService?.GetUserActiveBasketAsync?.Id.ToString(),
                Description = request.Description,
                Address = request.Address
            });

            await _orderHubService.OrderAddedMessageAsync("You have a new order!");

            return new();
        }
    }
}
