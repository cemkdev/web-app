using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Consts;
using WebAppAPI.Application.CustomAttributes;
using WebAppAPI.Application.Enums;
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
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Read, Definition = "Get All Orders")]
        public async Task<ActionResult> GetAllOrders([FromQuery] GetAllOrdersQueryRequest getAllOrdersQueryRequest)
        {
            GetAllOrdersQueryResponse response = await _mediator.Send(getAllOrdersQueryRequest);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Read, Definition = "Get Order by Id")]
        public async Task<ActionResult> GetOrderById([FromRoute] GetOrderByIdQueryRequest getOrderByIdQueryRequest)
        {
            GetOrderByIdQueryResponse response = await _mediator.Send(getOrderByIdQueryRequest);
            return Ok(response);
        }

        [HttpPost]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Write, Definition = "Create Order")]
        public async Task<ActionResult> CreateOrder(CreateOrderCommandRequest createOrderCommandRequest)
        {
            CreateOrderCommandResponse response = await _mediator.Send(createOrderCommandRequest);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Delete, Definition = "Delete Order")]
        public async Task<IActionResult> Delete([FromRoute] RemoveOrderCommandRequest removeOrderCommandRequest)
        {
            RemoveOrderCommandResponse response = await _mediator.Send(removeOrderCommandRequest);
            return Ok();
        }

        [HttpPost("deleterange")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Delete, Definition = "Delete Range of Order")]
        public async Task<IActionResult> DeleteRange([FromBody] RemoveRangeOrderCommandRequest removeRangeOrderCommandRequest)
        {
            RemoveRangeOrderCommandResponse response = await _mediator.Send(removeRangeOrderCommandRequest);
            return Ok();
        }

        [HttpPut("update-status")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Update, Definition = "Update Order Status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusCommandRequest updateStatusCommandRequest)
        {
            UpdateStatusCommandResponse response = await _mediator.Send(updateStatusCommandRequest);
            return Ok(response);
        }

        [HttpGet("get-status/{orderId}")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Orders, ActionType = ActionType.Read, Definition = "Get Order Status History by Id")]
        public async Task<ActionResult> GetOrderStatusHistoryById([FromRoute] GetOrderStatusHistoryByIdQueryRequest getOrderStatusHistoryByIdQueryRequest)
        {
            GetOrderStatusHistoryByIdQueryResponse response = await _mediator.Send(getOrderStatusHistoryByIdQueryRequest);
            return Ok(response);
        }
    }
}
