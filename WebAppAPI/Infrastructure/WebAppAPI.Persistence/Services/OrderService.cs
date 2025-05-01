using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs;
using WebAppAPI.Application.DTOs.Order;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Persistence.Services
{
    public class OrderService : IOrderService
    {
        readonly IOrderWriteRepository _orderWriteRepository;
        readonly IOrderReadRepository _orderReadRepository;
        readonly IConfiguration _configuration;

        public OrderService(IOrderWriteRepository orderWriteRepository, IOrderReadRepository orderReadRepository, IConfiguration configuration)
        {
            _orderWriteRepository = orderWriteRepository;
            _orderReadRepository = orderReadRepository;
            _configuration = configuration;
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

        public async Task<ListOrder> GetAllOrdersAsync(int page, int size)
        {
            var query = _orderReadRepository.Table
                            .Include(o => o.Basket)
                                .ThenInclude(b => b.BasketItems)
                            .Include(o => o.Basket.User);
            var dataPerPage = query.Skip(page * size).Take(size);

            return new()
            {
                TotalOrderCount = await query.CountAsync(),
                Orders = await dataPerPage.Select(o => new
                {
                    Id = o.Id.ToString(),
                    OrderCode = o.OrderCode,
                    CustomerName = $"{o.Basket.User.FirstName} {o.Basket.User.LastName}",
                    TotalPrice = o.Basket.BasketItems.Sum(item => item.Product.Price * item.Quantity),
                    DateCreated = o.DateCreated
                }).ToListAsync()
            };
        }

        public async Task<OrderDetail> GetOrderByIdAsync(string id)
        {
            var order = await _orderReadRepository.Table
                                .Include(o => o.Basket)
                                    .ThenInclude(b => b.BasketItems)
                                        .ThenInclude(bi => bi.Product)
                                            .ThenInclude(p => p.ProductImageFiles)
                                .FirstOrDefaultAsync(o => o.Id == Guid.Parse(id));

            var orderDetail = new OrderDetail()
            {
                Id = order.Id.ToString(),
                OrderCode = order.OrderCode,
                Description = order.Description,
                Address = order.Address,
                DateCreated = order.DateCreated,
                OrderBasketItems = order.Basket.BasketItems.Select(bi => new OrderItems()
                {
                    Name = bi.Product.Name,
                    Description = bi.Product.Description,
                    Price = bi.Product.Price,
                    Quantity = bi.Quantity,
                    Rating = bi.Product.Rating,
                    OrderProductImageFile = bi.Product.ProductImageFiles.Where(pif => pif.CoverImage == true).Select(pif => new BasketProductImageFile
                    {
                        ProductImageFileId = pif.Id.ToString(),
                        FileName = pif.FileName,
                        Path = $"{_configuration["BaseStorageUrl"]}/{pif.Path}"
                    }).FirstOrDefault()
                }).ToList()
            };

            return orderDetail;
        }

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
