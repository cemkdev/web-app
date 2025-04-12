using MediatR;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;
using E = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.Basket.UpdateQuantity
{
    public class UpdateQuantityCommandHandler : IRequestHandler<UpdateQuantityCommandRequest, UpdateQuantityCommandResponse>
    {
        readonly IBasketService _basketService;
        readonly IProductReadRepository _productReadRepository;

        public UpdateQuantityCommandHandler(IBasketService basketService, IProductReadRepository productReadRepository)
        {
            _basketService = basketService;
            _productReadRepository = productReadRepository;
        }

        public async Task<UpdateQuantityCommandResponse> Handle(UpdateQuantityCommandRequest request, CancellationToken cancellationToken)
        {
            E.Product product = await _productReadRepository.GetByIdAsync(request.ProductId);
            if (product == null)
                throw new Exception("Product not found.");
            if (request.Quantity > product.Stock)
                throw new Exception("Quantity exceeds available stock.");

            await _basketService.UpdateQuantityAsync(new()
            {
                BasketItemId = request.BasketItemId,
                Quantity = request.Quantity
            });
            return new();
        }
    }
}
