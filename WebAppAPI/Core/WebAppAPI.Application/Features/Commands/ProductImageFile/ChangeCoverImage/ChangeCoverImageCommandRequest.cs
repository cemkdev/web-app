using MediatR;

namespace WebAppAPI.Application.Features.Commands.ProductImageFile.ChangeCoverImage
{
    public class ChangeCoverImageCommandRequest : IRequest<ChangeCoverImageCommandResponse>
    {
        public string ImageId { get; set; }
        public string ProductId { get; set; }
    }
}
