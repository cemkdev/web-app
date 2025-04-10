using MediatR;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Commands.ProductImageFile.ChangeCoverImage
{
    public class ChangeCoverImageCommandHandler : IRequestHandler<ChangeCoverImageCommandRequest, ChangeCoverImageCommandResponse>
    {
        readonly IProductImageFileWriteRepository _productImageFileWriteRepository;

        public ChangeCoverImageCommandHandler(IProductImageFileWriteRepository productImageFileWriteRepository)
        {
            _productImageFileWriteRepository = productImageFileWriteRepository;
        }

        public async Task<ChangeCoverImageCommandResponse> Handle(ChangeCoverImageCommandRequest request, CancellationToken cancellationToken)
        {
            var query = _productImageFileWriteRepository.Table
                  .Include(p => p.Product)
                  .SelectMany(p => p.Product, (pif, p) => new
                  {
                      pif,
                      p
                  });

            var data = await query.FirstOrDefaultAsync(p => p.p.Id == Guid.Parse(request.ProductId) && p.pif.CoverImage);
            if (data != null)
                data.pif.CoverImage = false;

            var image = await query.FirstOrDefaultAsync(p => p.pif.Id == Guid.Parse(request.ImageId));
            if (image != null)
                image.pif.CoverImage = true;

            await _productImageFileWriteRepository.SaveAsync();

            return new();
        }
    }
}
