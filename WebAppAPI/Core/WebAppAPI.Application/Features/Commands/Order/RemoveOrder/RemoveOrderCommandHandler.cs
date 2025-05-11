using MediatR;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveOrder
{
    public class RemoveOrderCommandHandler : IRequestHandler<RemoveOrderCommandRequest, RemoveOrderCommandResponse>
    {
        readonly IOrderWriteRepository _orderWriteRepository;

        public RemoveOrderCommandHandler(IOrderWriteRepository orderWriteRepository)
        {
            _orderWriteRepository = orderWriteRepository;
        }

        public async Task<RemoveOrderCommandResponse> Handle(RemoveOrderCommandRequest request, CancellationToken cancellationToken)
        {
            await _orderWriteRepository.RemoveAsync(request.Id);
            await _orderWriteRepository.SaveAsync();

            return new();
        }
    }
}
