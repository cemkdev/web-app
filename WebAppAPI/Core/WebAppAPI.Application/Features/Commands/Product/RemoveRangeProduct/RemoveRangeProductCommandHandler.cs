using MediatR;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Commands.Product.RemoveRangeProduct
{
    public class RemoveRangeProductCommandHandler : IRequestHandler<RemoveRangeProductCommandRequest, RemoveRangeProductCommandResponse>
    {
        readonly IProductWriteRepository _productWriteRepository;

        public RemoveRangeProductCommandHandler(IProductWriteRepository productWriteRepository)
        {
            _productWriteRepository = productWriteRepository;
        }

        public async Task<RemoveRangeProductCommandResponse> Handle(RemoveRangeProductCommandRequest request, CancellationToken cancellationToken)
        {
            foreach (var RemovingProductId in request.ProductIds)
            {
                await _productWriteRepository.RemoveAsync(RemovingProductId);
            }
            await _productWriteRepository.SaveAsync();

            return new();
        }
    }
}
