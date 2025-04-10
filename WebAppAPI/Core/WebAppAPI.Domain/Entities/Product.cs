using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public int Stock { get; set; }
        public float Price { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float? Rating { get; set; } // Bunu şuan sadece ekranda göstermek için kullanıyoruz. Anlamı yok. Kaldırılacak.

        public ICollection<Order> Orders { get; set; }
        public ICollection<ProductImageFile> ProductImageFiles { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<BasketItem> BasketItems { get; set; }
    }
}
