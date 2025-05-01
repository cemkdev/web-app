using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Features.Commands.Order.CreateOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder;
using WebAppAPI.Application.Features.Queries.Order.GetAllOrders;
using WebAppAPI.Application.Features.Queries.Order.GetOrderById;

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

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetOrderById([FromRoute] GetOrderByIdQueryRequest getOrderByIdQueryRequest)
        {
            GetOrderByIdQueryResponse response = await _mediator.Send(getOrderByIdQueryRequest);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderCommandRequest createOrderCommandRequest)
        {
            CreateOrderCommandResponse response = await _mediator.Send(createOrderCommandRequest);
            return Ok(response);
        }

        // UYGULANMADI !!!
        [HttpDelete("{Id}")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] RemoveOrderCommandRequest removeOrderCommandRequest)
        {
            RemoveOrderCommandResponse response = await _mediator.Send(removeOrderCommandRequest);
            return Ok();
        }

        // UYGULANMADI !!!
        [HttpPost("deleterange")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> DeleteRange([FromBody] RemoveRangeOrderCommandRequest removeRangeOrderCommandRequest)
        {
            RemoveRangeOrderCommandResponse response = await _mediator.Send(removeRangeOrderCommandRequest);
            return Ok();
        }
    }
}
