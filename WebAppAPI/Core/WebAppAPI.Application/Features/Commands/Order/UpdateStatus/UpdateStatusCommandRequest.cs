using MediatR;

namespace WebAppAPI.Application.Features.Commands.Order.UpdateStatus
{
    public class UpdateStatusCommandRequest : IRequest<UpdateStatusCommandResponse>
    {
        public string OrderId { get; set; }
        public int NewStatus { get; set; }
    }
}
