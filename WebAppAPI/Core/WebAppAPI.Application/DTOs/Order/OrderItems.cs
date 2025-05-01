namespace WebAppAPI.Application.DTOs.Order
{
    public class OrderItems
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public int Quantity { get; set; }
        public float? Rating { get; set; }
        public BasketProductImageFile? OrderProductImageFile { get; set; }
    }
}
