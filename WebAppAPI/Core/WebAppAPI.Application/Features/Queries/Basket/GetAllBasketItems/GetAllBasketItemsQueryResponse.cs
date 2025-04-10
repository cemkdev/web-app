using WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Features.Queries.Basket.GetAllBasketItems
{
    public class GetAllBasketItemsQueryResponse
    {
        public string BasketItemId { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        public float Price { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public BasketProductImageFile? ProductImageFile { get; set; }
    }
}
