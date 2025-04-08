using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppAPI.Domain.Entities
{
    public class ProductImageFile : File
    {
        public bool CoverImage { get; set; }
        public ICollection<Product> Product { get; set; }
    }
}
