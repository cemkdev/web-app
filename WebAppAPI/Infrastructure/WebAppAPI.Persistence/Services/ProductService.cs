using System.Text.Json;
using WebAppAPI.Application.Abstractions;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.Persistence.Services
{
    public class ProductService : IProductService
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IQRCodeService _qrCodeService;

        public ProductService(IProductReadRepository productReadRepository, IQRCodeService qrCodeService)
        {
            _productReadRepository = productReadRepository;
            _qrCodeService = qrCodeService;
        }

        public async Task<byte[]> QrCodeFromProductAsync(string productId)
        {
            Product product = await _productReadRepository.GetByIdAsync(productId);

            if (product == null)
                throw new Exception("Product not found.");

            var plainObject = new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Stock,
                product.DateCreated
            };
            string plainText = JsonSerializer.Serialize(plainObject);

            return _qrCodeService.GenerateQRCode(plainText);
        }
    }
}
