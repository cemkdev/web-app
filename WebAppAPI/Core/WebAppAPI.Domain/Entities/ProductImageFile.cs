namespace WebAppAPI.Domain.Entities
{
    public class ProductImageFile : File
    {
        public bool CoverImage { get; set; }
        public ICollection<Product> Product { get; set; }
    }
}
