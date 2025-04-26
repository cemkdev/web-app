using MediatR;

namespace WebAppAPI.Application.Features.Commands.Product.RemoveRangeProduct
{
    public class RemoveRangeProductCommandRequest : IRequest<RemoveRangeProductCommandResponse>
    {
        public List<string> ProductIds { get; set; }
    }
}
