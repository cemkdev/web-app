using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Queries.Product.GetByIdProduct
{
    public class GetByIdProductQueryResponse
    {
        public string Name { get; set; }
        public int Stock { get; set; }
        public float Price { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float? Rating { get; set; }
    }
}
