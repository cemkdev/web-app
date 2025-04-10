using MediatR;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Application.Repositories;
using E = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.ProductImageFile.RemoveProductImage
{
    public class RemoveProductImageCommandHandler : IRequestHandler<RemoveProductImageCommandRequest, RemoveProductImageCommandResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IProductWriteRepository _productWriteRepository;

        public RemoveProductImageCommandHandler(IProductReadRepository productReadRepository, IProductWriteRepository productWriteRepository)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
        }

        public async Task<RemoveProductImageCommandResponse> Handle(RemoveProductImageCommandRequest request, CancellationToken cancellationToken)
        {
            E.Product? product = await _productReadRepository.Table.Include(p => p.ProductImageFiles)
                                                                 .FirstOrDefaultAsync(p => p.Id == Guid.Parse(request.Id));

            E.ProductImageFile? productImageFile = product?.ProductImageFiles.Where(i => i.Storage == "AzureStorage")
                                                                         .FirstOrDefault(p => p.Id == Guid.Parse(request.ImageId));
            if (productImageFile != null)
                product?.ProductImageFiles.Remove(productImageFile);

            await _productWriteRepository.SaveAsync();

            return new();
        }
    }
}
