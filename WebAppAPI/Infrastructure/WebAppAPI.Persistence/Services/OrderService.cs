using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.Order;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Persistence.Services
{
    public class OrderService : IOrderService
    {
        readonly IOrderWriteRepository _orderWriteRepository;
        readonly IOrderReadRepository _orderReadRepository;

        public OrderService(IOrderWriteRepository orderWriteRepository, IOrderReadRepository orderReadRepository)
        {
            _orderWriteRepository = orderWriteRepository;
            _orderReadRepository = orderReadRepository;
        }

        public async Task CreateOrderAsync(CreateOrder createOrder)
        {
            await _orderWriteRepository.AddAsync(new()
            {
                Id = Guid.Parse(createOrder.BasketId),
                Address = createOrder.Address,
                Description = createOrder.Description,
                OrderCode = GenerateOrderCode()
            });
            await _orderWriteRepository.SaveAsync();
        }

        public async Task<List<ListOrder>> GetAllOrdersAsync()
             => await _orderReadRepository.Table
                            .Include(o => o.Basket)
                                .ThenInclude(b => b.BasketItems)
                            .Include(o => o.Basket.User)
                            .Select(o => new ListOrder
                            {
                                Id = o.Id.ToString(),
                                OrderCode = o.OrderCode,
                                UserName = o.Basket.User.UserName,
                                TotalPrice = o.Basket.BasketItems.Sum(item => item.Product.Price * item.Quantity),
                                DateCreated = o.DateCreated
                            })
                            .ToListAsync();

        #region Helpers
        private string GenerateOrderCode()
        {
            Span<byte> buffer = stackalloc byte[8];
            RandomNumberGenerator.Fill(buffer);
            long randomNumber = BitConverter.ToInt64(buffer);

            long positive10Digit = Math.Abs(randomNumber % 9_000_000_000L) + 1_000_000_000L;
            string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmm");

            // String Interpolation - (It is enough fot this app.)
            //return $"ORD_{positive10Digit}_{timestamp}";

            // string.Create() - more memory-friendly string concatenation.(If necessary...)
            return string.Create(
                4 + 10 + 1 + 12, // "ORD_" + 10 digits + "_" + timestamp (yyyyMMddHHmm)
                (positive10Digit, timestamp),
                static (span, state) =>
                {
                    var (number, ts) = state;

                    // "ORD_"
                    "ORD_".AsSpan().CopyTo(span.Slice(0, 4));

                    // 10 digits number
                    number.TryFormat(span.Slice(4, 10), out _);

                    // "_"
                    span[14] = '_';

                    // timestamp
                    ts.AsSpan().CopyTo(span.Slice(15));
                }
            );
        }
        #endregion
    }
}
