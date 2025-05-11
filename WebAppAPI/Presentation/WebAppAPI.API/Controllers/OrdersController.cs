using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Features.Commands.Order.CreateOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveOrder;
using WebAppAPI.Application.Features.Commands.Order.RemoveRangeOrder;
using WebAppAPI.Application.Features.Commands.Order.UpdateStatus;
using WebAppAPI.Application.Features.Queries.Order.GetAllOrders;
using WebAppAPI.Application.Features.Queries.Order.GetOrderById;
using WebAppAPI.Application.Features.Queries.Order.GetOrderStatusHistoryById;

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

        [HttpGet("{id}")]
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] RemoveOrderCommandRequest removeOrderCommandRequest)
        {
            RemoveOrderCommandResponse response = await _mediator.Send(removeOrderCommandRequest);
            return Ok();
        }

        [HttpPost("deleterange")]
        public async Task<IActionResult> DeleteRange([FromBody] RemoveRangeOrderCommandRequest removeRangeOrderCommandRequest)
        {
            RemoveRangeOrderCommandResponse response = await _mediator.Send(removeRangeOrderCommandRequest);
            return Ok();
        }

        [HttpPut("update-status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusCommandRequest updateStatusCommandRequest)
        {
            UpdateStatusCommandResponse response = await _mediator.Send(updateStatusCommandRequest);
            return Ok(response);
        }

        [HttpGet("get-status/{orderId}")]
        public async Task<ActionResult> GetOrderStatusHistoryById([FromRoute] GetOrderStatusHistoryByIdQueryRequest getOrderStatusHistoryByIdQueryRequest)
        {
            GetOrderStatusHistoryByIdQueryResponse response = await _mediator.Send(getOrderStatusHistoryByIdQueryRequest);
            return Ok(response);
        }
    }
}
