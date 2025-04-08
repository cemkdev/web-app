using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
        readonly ILogger<GetAllProductsQueryHandler> _logger;

        public GetAllProductsQueryHandler(IProductReadRepository productReadRepository, ILogger<GetAllProductsQueryHandler> logger)
        {
            _productReadRepository = productReadRepository;
            _logger = logger;
        }

        public async Task<GetAllProductsQueryResponse> Handle(GetAllProductsQueryRequest request, CancellationToken cancellationToken)
        {
            var totalProductCount = _productReadRepository.GetAll(false).Count();
            var products = _productReadRepository.GetAll(false).OrderBy(o => o.Stock)
                .Skip(request.Page * request.Size).Take(request.Size)
                .Include(i => i.ProductImageFiles)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Stock,
                    p.Price,
                    p.DateCreated,
                    p.DateUpdated,
                    p.Title,
                    p.Description,
                    p.Rating,
                    p.ProductImageFiles
                }).ToList();

            return new()
            {
                Products = products,
                TotalProductCount = totalProductCount
            };
        }
    }
}
