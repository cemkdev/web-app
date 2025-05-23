using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Features.Commands.Endpoint.AssignRoleEndpoint;
using WebAppAPI.Application.Features.Queries.Endpoint.GetRolesEndpoints;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EndpointsController : ControllerBase
    {
        readonly IMediator _mediator;

        public EndpointsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("get-roles-endpoints")]
        public async Task<IActionResult> GetRolesEndpoints([FromQuery] GetRolesEndpointsQueryRequest getRolesEndpointsQueryRequest)
        {
            GetRolesEndpointsQueryResponse response = await _mediator.Send(getRolesEndpointsQueryRequest);
            return Ok(response);
        }

        [HttpPost("assign-role-endpoints")]
        public async Task<IActionResult> AssignRoleEndpoints([FromBody] AssignRoleEndpointCommandRequest assignRoleEndpointCommandRequest)
        {
            assignRoleEndpointCommandRequest.Type = typeof(Program);
            AssignRoleEndpointCommandResponse response = await _mediator.Send(assignRoleEndpointCommandRequest);
            return Ok(response);
        }
    }
}
