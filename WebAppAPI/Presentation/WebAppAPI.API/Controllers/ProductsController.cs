using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebAppAPI.Application.Abstractions.Storage;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Application.RequestParameters;
using WebAppAPI.Application.ViewModels.Products;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductReadRepository _productReadRepository;
        private readonly IProductWriteRepository _productWriteRepository;
        readonly IFileReadRepository _fileReadRepository;
        readonly IFileWriteRepository _fileWriteRepository;
        readonly IProductImageFileReadRepository _productImageFileReadRepository;
        readonly IProductImageFileWriteRepository _productImageFileWriteRepository;
        readonly IInvoiceFileReadRepository _invoiceFileReadRepository;
        readonly IInvoiceFileWriteRepository _invoiceFileWriteRepository;
        readonly IStorageService _storageService;

        public ProductsController(
            IProductReadRepository productReadRepository,
            IProductWriteRepository productWriteRepository,
            IFileReadRepository fileReadRepository,
            IFileWriteRepository fileWriteRepository,
            IProductImageFileReadRepository productImageFileReadRepository,
            IProductImageFileWriteRepository productImageFileWriteRepository,
            IInvoiceFileReadRepository invoiceFileReadRepository,
            IInvoiceFileWriteRepository invoiceFileWriteRepository,
            IStorageService storageService)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
            _fileReadRepository = fileReadRepository;
            _fileWriteRepository = fileWriteRepository;
            _productImageFileReadRepository = productImageFileReadRepository;
            _productImageFileWriteRepository = productImageFileWriteRepository;
            _invoiceFileReadRepository = invoiceFileReadRepository;
            _invoiceFileWriteRepository = invoiceFileWriteRepository;
            _storageService = storageService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] Pagination pagination)
        {
            var totalCount = _productReadRepository.GetAll(false).Count();
            var products = _productReadRepository.GetAll(false).Select(p => new
            {
                p.Id,
                p.Name,
                p.Stock,
                p.Price,
                p.DateCreated,
                p.DateUpdated
            }).OrderBy(o => o.DateCreated).Skip(pagination.Page * pagination.Size).Take(pagination.Size).ToList();

            return Ok(new
            {
                totalCount,
                products
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            return Ok(_productReadRepository.GetByIdAsync(id, false));
        }

        [HttpPost]
        public async Task<IActionResult> Post(VM_Product_Create model)
        {
            if (ModelState.IsValid)
            {

            }

            await _productWriteRepository.AddAsync(new()
            {
                Name = model.Name,
                Stock = model.Stock,
                Price = model.Price
            });
            await _productWriteRepository.SaveAsync();

            return StatusCode((int)HttpStatusCode.Created);
        }

        [HttpPut]
        public async Task<IActionResult> Put(VM_Product_Update model)
        {
            Product product = await _productReadRepository.GetByIdAsync(model.Id);
            product.Name = model.Name;
            product.Stock = model.Stock;
            product.Price = model.Price;

            await _productWriteRepository.SaveAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _productWriteRepository.RemoveAsync(id);
            await _productWriteRepository.SaveAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Upload(string id)
        {
            List<(string fileName, string pathOrContainerName)> data = await _storageService.UploadAsync("images", Request.Form.Files);

            Product product = await _productReadRepository.GetByIdAsync(id);

            //// Bu da Product'ın ilişkisel olan navigation property'si üzerinden Add() diyerek döne döne foreach ile elimizdeki bütün ProductImageFile'leri eklenmesi yöntemi.
            //// Ama biz alttaki yöntemi kullanacağız.
            //foreach (var file in data)
            //{
            //    product.ProductImageFiles.Add(new()
            //    {
            //        FileName = file.fileName,
            //        Path = file.pathOrContainerName,
            //        Storage = _storageService.StorageName,
            //        Product = new List<Product>() { product }
            //    });
            //}

            // Bu da ProductImageFile üzerinden onlar eklenirken Product'ların var olan AddRangeAsync() method'umuzla eklenmesi.
            // Yani bu açıklama tam doğru oldu mu bilmiyorum ama bunun gibi bir şey.
            await _productImageFileWriteRepository.AddRangeAsync(data.Select(d => new ProductImageFile
            {
                FileName = d.fileName,
                Path = d.pathOrContainerName,
                Storage = _storageService.StorageName,
                Product = new List<Product>() { product }
            }).ToList());

            await _productImageFileWriteRepository.SaveAsync();

            return Ok();
        }
    }
}
