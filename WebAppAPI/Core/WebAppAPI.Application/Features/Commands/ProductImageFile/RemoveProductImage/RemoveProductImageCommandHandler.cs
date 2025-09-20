using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.IO;
using WebAppAPI.Application.Repositories;
using E = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.ProductImageFile.RemoveProductImage
{
    public class RemoveProductImageCommandHandler : IRequestHandler<RemoveProductImageCommandRequest, RemoveProductImageCommandResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IProductWriteRepository _productWriteRepository;
        readonly IFileWriteRepository _fileWriteRepository;
        readonly IWebHostEnvironment _webHostEnvironment;

        public RemoveProductImageCommandHandler(IProductReadRepository productReadRepository, IProductWriteRepository productWriteRepository, IFileWriteRepository fileWriteRepository, IWebHostEnvironment webHostEnvironment)
        {
            _productReadRepository = productReadRepository;
            _productWriteRepository = productWriteRepository;
            _fileWriteRepository = fileWriteRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<RemoveProductImageCommandResponse> Handle(RemoveProductImageCommandRequest request, CancellationToken cancellationToken)
        {
            string fullPath = null;
            string webRoot = null;

            E.Product? product = await _productReadRepository.Table.Include(p => p.ProductImageFiles)
                                                                 .FirstOrDefaultAsync(p => p.Id == Guid.Parse(request.Id));

            E.ProductImageFile? productImageFile = product?.ProductImageFiles.FirstOrDefault(p => p.Id == Guid.Parse(request.ImageId));
            if (productImageFile != null)
            {
                _fileWriteRepository.Remove(productImageFile);

                if (productImageFile.Storage == "LocalStorage")
                {
                    webRoot = _webHostEnvironment.WebRootPath;
                    if (!string.IsNullOrEmpty(webRoot))
                    {
                        fullPath = Path.Combine(webRoot, productImageFile.Path);
                        if (File.Exists(fullPath))
                            File.Delete(fullPath);
                    }
                }
            }

            await _productWriteRepository.SaveAsync();

            return new();
        }
    }
}
