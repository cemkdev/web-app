using MediatR;

namespace WebAppAPI.Application.Features.Queries.Basket.GetAllBasketItems
{
    public class GetAllBasketItemsQueryRequest : IRequest<List<GetAllBasketItemsQueryResponse>>
    {
    }
}
