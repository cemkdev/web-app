using WebAppAPI.Application.DTOs.Order;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IOrderService
    {
        Task CreateOrderAsync(CreateOrder createOrder);
        Task<List<ListOrder>> GetAllOrdersAsync();
    }
}
