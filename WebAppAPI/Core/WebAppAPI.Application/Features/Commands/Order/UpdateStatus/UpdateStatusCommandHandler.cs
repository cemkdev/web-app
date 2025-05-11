using MediatR;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.Order;
using WebAppAPI.Domain.Enums;

namespace WebAppAPI.Application.Features.Commands.Order.UpdateStatus
{
    public class UpdateStatusCommandHandler : IRequestHandler<UpdateStatusCommandRequest, UpdateStatusCommandResponse>
    {
        readonly IOrderService _orderService;
        readonly IMailService _mailService;

        public UpdateStatusCommandHandler(IOrderService orderService, IMailService mailService)
        {
            _orderService = orderService;
            _mailService = mailService;
        }

        public async Task<UpdateStatusCommandResponse> Handle(UpdateStatusCommandRequest request, CancellationToken cancellationToken)
        {
            await _orderService.UpdateOrderStatusAsync(request.OrderId, (OrderStatusEnum)request.NewStatus);
            return new();
        }
    }
}
