using MediatR;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder
{
    public class RemoveRangeOrderCommandRequest : IRequest<RemoveRangeOrderCommandResponse>
    {
        public List<string> OrderIds { get; set; }
    }
}
