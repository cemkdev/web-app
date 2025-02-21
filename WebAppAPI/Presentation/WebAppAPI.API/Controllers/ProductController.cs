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
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IProductReadRepository _productReadRepository;

        public ProductController(IProductWriteRepository productWriteRepository, IProductReadRepository productReadRepository)
        {
            _productWriteRepository = productWriteRepository;
            _productReadRepository = productReadRepository;
        }

        //[HttpGet]
        //public async Task Write()
        //{
        //    await _productWriteRepository.AddRangeAsync(new()
        //    {
        //        new() { Id = Guid.NewGuid(), Name = "Product 3", Price = 100, DateCreated = DateTime.UtcNow, Stock = 10 },
        //        new() { Id = Guid.NewGuid(), Name = "Product 4", Price = 200, DateCreated = DateTime.UtcNow, Stock = 20 },
        //        new() { Id = Guid.NewGuid(), Name = "Product 5", Price = 300, DateCreated = DateTime.UtcNow, Stock = 100 },
        //    });

        //    await _productWriteRepository.SaveAsync();
        //}

        [HttpGet]
        public async Task Get()
        {
            Product product = await _productReadRepository.GetByIdAsync("022f6218-326c-4826-8ef4-5ed34a0d8eca");
            product.Name = "jam2";
            await _productWriteRepository.SaveAsync(); // Scoped Context instance. Same requests, same scope.
            // Therefore, we were able to perform operations on two different repositories and send the data to the db with a single 'Save'.
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> Get(string id)
        //{
        //    Product product = await _productReadRepository.GetByIdAsync(id);
        //    return Ok(product);
        //}
    }
}
