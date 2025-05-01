using WebAppAPI.Application.DTOs.Order;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IOrderService
    {
        Task CreateOrderAsync(CreateOrder createOrder);
        Task<ListOrder> GetAllOrdersAsync(int page, int size);
        Task<OrderDetail> GetOrderByIdAsync(string id);
    }
}
