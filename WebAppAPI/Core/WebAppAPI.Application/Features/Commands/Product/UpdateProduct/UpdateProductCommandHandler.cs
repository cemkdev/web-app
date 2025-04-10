using MediatR;
using Microsoft.Extensions.Logging;
using WebAppAPI.Application.Repositories;
using E = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.Product.UpdateProduct
{
    internal class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommandRequest, UpdateProductCommandResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IProductWriteRepository _productWriteRepository;
        readonly ILogger<UpdateProductCommandHandler> _logger;

        public UpdateProductCommandHandler(
            IProductReadRepository productReadRepository,
            IProductWriteRepository productWriteRepository,
            ILogger<UpdateProductCommandHandler> logger)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
            _logger = logger;
        }

        public async Task<UpdateProductCommandResponse> Handle(UpdateProductCommandRequest request, CancellationToken cancellationToken)
        {
            E.Product product = await _productReadRepository.GetByIdAsync(request.Id);
            product.Name = request.Name ?? product.Name;
            product.Stock = request.Stock ?? product.Stock;
            product.Price = request.Price ?? product.Price;
            product.Title = request.Title ?? product.Title;
            product.Description = request.Description ?? product.Description;
            await _productWriteRepository.SaveAsync();

            _logger.LogInformation("Product updated...");

            return new();
        }
    }
}
