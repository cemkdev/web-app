using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Application.RequestParameters;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Queries.Product.GetAllProducts
{
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQueryRequest, GetAllProductsQueryResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        public GetAllProductsQueryHandler(IProductReadRepository productReadRepository)
        {
            _productReadRepository = productReadRepository;
        }

        public async Task<GetAllProductsQueryResponse> Handle(GetAllProductsQueryRequest request, CancellationToken cancellationToken)
        {
            var totalCount = _productReadRepository.GetAll(false).Count();
            var products = _productReadRepository.GetAll(false).OrderBy(o => o.DateCreated).Skip(request.Page * request.Size).Take(request.Size).Select(p => new
            {
                p.Id,
                p.Name,
                p.Stock,
                p.Price,
                p.DateCreated,
                p.DateUpdated
            }).ToList();

            return new()
            {
                Products = products,
                TotalCount = totalCount
            };
        }
    }
}
