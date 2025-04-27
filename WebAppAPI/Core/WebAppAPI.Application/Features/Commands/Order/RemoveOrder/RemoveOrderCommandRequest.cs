using MediatR;

namespace WebAppAPI.Application.Features.Commands.Order.RemoveOrder
{
    public class RemoveOrderCommandRequest : IRequest<RemoveOrderCommandResponse>
    {
        public string Id { get; set; }
    }
}
