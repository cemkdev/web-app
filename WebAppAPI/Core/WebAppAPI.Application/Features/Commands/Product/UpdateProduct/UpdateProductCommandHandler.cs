using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Application.Repositories;
using P = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.Product.UpdateProduct
{
    internal class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommandRequest, UpdateProductCommandResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IProductWriteRepository _productWriteRepository;

        public UpdateProductCommandHandler(
            IProductReadRepository productReadRepository,
            IProductWriteRepository productWriteRepository)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
        }

        public async Task<UpdateProductCommandResponse> Handle(UpdateProductCommandRequest request, CancellationToken cancellationToken)
        {
            P.Product product = await _productReadRepository.GetByIdAsync(request.Id);
            product.Name = request.Name;
            product.Stock = request.Stock;
            product.Price = request.Price;
            await _productWriteRepository.SaveAsync();

            return new();
        }
    }
}
