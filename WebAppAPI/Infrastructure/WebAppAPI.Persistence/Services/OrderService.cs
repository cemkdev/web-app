using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.Order;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Persistence.Services
{
    public class OrderService : IOrderService
    {
        readonly IOrderWriteRepository _orderWriteRepository;

        public OrderService(IOrderWriteRepository orderWriteRepository)
        {
            _orderWriteRepository = orderWriteRepository;
        }

        public async Task CreateOrderAsync(CreateOrder createOrder)
        {
            await _orderWriteRepository.AddAsync(new()
            {
                Id = Guid.Parse(createOrder.BasketId),
                Address = createOrder.Address,
                Description = createOrder.Description
            });
            await _orderWriteRepository.SaveAsync();
        }
    }
}
