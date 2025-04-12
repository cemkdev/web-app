using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Features.Commands.Basket.AddItemToBasket;
using WebAppAPI.Application.Features.Commands.Basket.RemoveBasketItem;
using WebAppAPI.Application.Features.Commands.Basket.UpdateQuantity;
using WebAppAPI.Application.Features.Queries.Basket.GetAllBasketItems;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Admin")]
    public class BasketsController : ControllerBase
    {
        readonly IMediator _mediator;

        public BasketsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBasketItems([FromQuery] GetAllBasketItemsQueryRequest getAllBasketItemsQueryRequest)
        {
            List<GetAllBasketItemsQueryResponse> response = await _mediator.Send(getAllBasketItemsQueryRequest);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> AddItemToBasket(AddItemToBasketCommandRequest addItemToBasketCommandRequest)
        {
            AddItemToBasketCommandResponse response = await _mediator.Send(addItemToBasketCommandRequest);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuantity(UpdateQuantityCommandRequest updateQuantityCommandRequest)
        {
            if (updateQuantityCommandRequest.Quantity < 1)
                throw new BadHttpRequestException("Invalid Request!");

            UpdateQuantityCommandResponse response = await _mediator.Send(updateQuantityCommandRequest);
            return Ok(response);
        }

        [HttpDelete("{BasketItemId}")]
        public async Task<IActionResult> RemoveBasketItem([FromRoute] RemoveBasketItemCommandRequest removeBasketItemCommandRequest)
        {
            RemoveBasketItemCommandResponse response = await _mediator.Send(removeBasketItemCommandRequest);
            return Ok(response);
        }
    }
}
