using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Application.Abstractions.Storage;
using WebAppAPI.Application.Repositories;
using P = WebAppAPI.Domain.Entities;

namespace WebAppAPI.Application.Features.Commands.ProductImageFile.UploadProductImage
{
    public class UploadProductImageCommandHandler : IRequestHandler<UploadProductImageCommandRequest, UploadProductImageCommandResponse>
    {
        readonly IProductReadRepository _productReadRepository;
        readonly IProductImageFileWriteRepository _productImageFileWriteRepository;
        readonly IStorageService _storageService;

        public UploadProductImageCommandHandler(IProductReadRepository productReadRepository, IProductImageFileWriteRepository productImageFileWriteRepository, IStorageService storageService)
        {
            _productReadRepository = productReadRepository;
            _productImageFileWriteRepository = productImageFileWriteRepository;
            _storageService = storageService;
        }

        public async Task<UploadProductImageCommandResponse> Handle(UploadProductImageCommandRequest request, CancellationToken cancellationToken)
        {
            List<(string fileName, string pathOrContainerName)> data = await _storageService.UploadAsync("images", request.Files);
            P.Product product = await _productReadRepository.GetByIdAsync(request.Id);

            await _productImageFileWriteRepository.AddRangeAsync(data.Select(d => new P.ProductImageFile
            {
                FileName = d.fileName,
                Path = d.pathOrContainerName,
                Storage = _storageService.StorageName,
                Product = new List<P.Product>() { product }
            }).ToList());

            await _productImageFileWriteRepository.SaveAsync();

            return new();
        }
    }
}
