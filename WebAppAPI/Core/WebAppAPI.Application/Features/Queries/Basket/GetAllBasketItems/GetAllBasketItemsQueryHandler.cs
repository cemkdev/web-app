using MediatR;
using Microsoft.Extensions.Configuration;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Queries.Basket.GetAllBasketItems
{
    public class GetAllBasketItemsQueryHandler : IRequestHandler<GetAllBasketItemsQueryRequest, List<GetAllBasketItemsQueryResponse>>
    {
        readonly IBasketService _basketService;
        readonly IConfiguration _configuration;

        public GetAllBasketItemsQueryHandler(IBasketService basketService, IProductImageFileReadRepository productImageFileReadRepository, IConfiguration configuration)
        {
            _basketService = basketService;
            _configuration = configuration;
        }

        public async Task<List<GetAllBasketItemsQueryResponse>> Handle(GetAllBasketItemsQueryRequest request, CancellationToken cancellationToken)
        {
            var basketItems = await _basketService.GetAllBasketItemsAsync();

            return basketItems.Select(bi => new GetAllBasketItemsQueryResponse()
            {
                BasketItemId = bi.Id.ToString(),
                ProductId = bi.ProductId.ToString(),
                Name = bi.Product.Name,
                Description = bi.Product.Description,
                Price = bi.Product.Price,
                Stock = bi.Product.Stock,
                Quantity = bi.Quantity,
                ProductImageFile = bi.Product.ProductImageFiles?.Where(pif => pif.CoverImage == true).Select(pif => new BasketProductImageFile()
                {
                    ProductImageFileId = pif.Id.ToString(),
                    FileName = pif.FileName,
                    Path = $"{_configuration["BaseStorageUrl"]}/{pif.Path}",
                }).FirstOrDefault()
            }).ToList();
        }
    }
}
