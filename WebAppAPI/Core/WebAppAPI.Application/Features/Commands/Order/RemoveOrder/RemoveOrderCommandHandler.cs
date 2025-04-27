using MediatR;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveOrder
{
    public class RemoveOrderCommandHandler : IRequestHandler<RemoveOrderCommandRequest, RemoveOrderCommandResponse>
    {
        public async Task<RemoveOrderCommandResponse> Handle(RemoveOrderCommandRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
