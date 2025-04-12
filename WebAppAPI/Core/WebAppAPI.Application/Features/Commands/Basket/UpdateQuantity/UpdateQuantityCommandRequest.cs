using MediatR;

namespace WebAppAPI.Application.Features.Commands.Basket.UpdateQuantity
{
    public class UpdateQuantityCommandRequest : IRequest<UpdateQuantityCommandResponse>
    {
        public string BasketItemId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
