﻿using WebAppAPI.Application.DTOs.Order;
using WebAppAPI.Domain.Enums;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IOrderService
    {
        Task<string> CreateOrderAsync(CreateOrder createOrder);
        Task<ListOrder> GetAllOrdersAsync(int page, int size);
        Task<OrderDetail> GetOrderByIdAsync(string id);
        Task UpdateOrderStatusAsync(string orderId, OrderStatusEnum newStatus);
        Task<OrderStatusHistoryDto> GetOrderStatusHistoryByIdAsync(string orderId);
    }
}
