using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public float? Rating { get; set; }

        public ICollection<Order> Orders { get; set; }
        public ICollection<ProductImageFile> ProductImageFiles { get; set; }
        public ICollection<Rating> Ratings { get; set; }
    }
}
