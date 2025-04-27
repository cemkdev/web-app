using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Features.Commands.Order.CreateOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder;
using WebAppAPI.Application.Features.Queries.Order.GetAllOrders;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Admin")]
    public class OrdersController : ControllerBase
    {
        readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllOrders([FromQuery] GetAllOrdersQueryRequest getAllOrdersQueryRequest)
        {
            GetAllOrdersQueryResponse response = await _mediator.Send(getAllOrdersQueryRequest);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderCommandRequest createOrderCommandRequest)
        {
            CreateOrderCommandResponse response = await _mediator.Send(createOrderCommandRequest);
            return Ok(response);
        }

        [HttpDelete("{Id}")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] RemoveOrderCommandRequest removeOrderCommandRequest)
        {
            RemoveOrderCommandResponse response = await _mediator.Send(removeOrderCommandRequest);
            return Ok();
        }

        [HttpPost("deleterange")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> DeleteRange([FromBody] RemoveRangeOrderCommandRequest removeRangeOrderCommandRequest)
        {
            RemoveRangeOrderCommandResponse response = await _mediator.Send(removeRangeOrderCommandRequest);
            return Ok();
        }
    }
}
