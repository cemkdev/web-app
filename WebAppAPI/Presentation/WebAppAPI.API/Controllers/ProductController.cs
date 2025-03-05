using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Threading.Tasks;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductReadRepository _productReadRepository;
        private readonly IOrderReadRepository _orderReadRepository;

        public ProductController(
            IProductReadRepository productReadRepository,
            IOrderReadRepository orderReadRepository)
        {
            _productReadRepository = productReadRepository;
            _orderReadRepository = orderReadRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok("Merhaba");
        }
    }
}
