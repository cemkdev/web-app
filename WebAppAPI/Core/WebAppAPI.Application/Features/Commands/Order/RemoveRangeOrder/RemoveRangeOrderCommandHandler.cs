using MediatR;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder
{
    public class RemoveRangeOrderCommandHandler : IRequestHandler<RemoveRangeOrderCommandRequest, RemoveRangeOrderCommandResponse>
    {
        readonly IOrderWriteRepository _orderWriteRepository;

        public RemoveRangeOrderCommandHandler(IOrderWriteRepository orderWriteRepository)
        {
            _orderWriteRepository = orderWriteRepository;
        }

        public async Task<RemoveRangeOrderCommandResponse> Handle(RemoveRangeOrderCommandRequest request, CancellationToken cancellationToken)
        {
            foreach (var RemovingOrderId in request.OrderIds)
            {
                await _orderWriteRepository.RemoveAsync(RemovingOrderId);
            }
            await _orderWriteRepository.SaveAsync();

            return new();
        }
    }
}
