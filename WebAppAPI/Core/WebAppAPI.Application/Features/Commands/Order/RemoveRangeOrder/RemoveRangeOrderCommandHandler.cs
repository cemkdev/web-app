using MediatR;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder
{
    public class RemoveRangeOrderCommandHandler : IRequestHandler<RemoveRangeOrderCommandRequest, RemoveRangeOrderCommandResponse>
    {
        public async Task<RemoveRangeOrderCommandResponse> Handle(RemoveRangeOrderCommandRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
