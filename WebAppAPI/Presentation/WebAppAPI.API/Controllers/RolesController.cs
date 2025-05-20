using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Consts;
using WebAppAPI.Application.CustomAttributes;
using WebAppAPI.Application.Enums;
using WebAppAPI.Application.Features.Commands.Role.CreateRole;
using WebAppAPI.Application.Features.Commands.Role.DeleteRange;
using WebAppAPI.Application.Features.Commands.Role.DeleteRole;
using WebAppAPI.Application.Features.Commands.Role.UpdateRole;
using WebAppAPI.Application.Features.Queries.Role.GetRoleById;
using WebAppAPI.Application.Features.Queries.Role.GetRoles;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Admin")]
    public class RolesController : ControllerBase
    {
        readonly IMediator _mediator;

        public RolesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("get-roles")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Get Roles", ActionType = ActionType.Read)]
        public async Task<IActionResult> GetRoles([FromQuery] GetRolesQueryRequest getRolesQueryRequest)
        {
            List<GetRolesQueryResponse> response = await _mediator.Send(getRolesQueryRequest);
            return Ok(response);
        }

        [HttpGet("get-role-by-id/{id}")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Get Role By Id", ActionType = ActionType.Read)]
        public async Task<IActionResult> GetRoleById([FromRoute] GetRoleByIdQueryRequest getRoleByIdQueryRequest)
        {
            GetRoleByIdQueryResponse response = await _mediator.Send(getRoleByIdQueryRequest);
            return Ok(response);
        }

        [HttpPost("create-role")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Create Role", ActionType = ActionType.Write)]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleCommandRequest createRoleCommandRequest)
        {
            CreateRoleCommandResponse response = await _mediator.Send(createRoleCommandRequest);
            return Ok(response);
        }

        [HttpPut("update-role")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Update Role", ActionType = ActionType.Update)]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleCommandRequest updateRoleCommandRequest)
        {
            UpdateRoleCommandResponse response = await _mediator.Send(updateRoleCommandRequest);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Delete Role", ActionType = ActionType.Delete)]
        public async Task<IActionResult> DeleteRole([FromRoute] DeleteRoleCommandRequest deleteRoleCommandRequest)
        {
            DeleteRoleCommandResponse response = await _mediator.Send(deleteRoleCommandRequest);
            return Ok(response);
        }

        [HttpPost("delete-range-role")]
        [Authorize(AuthenticationSchemes = "Admin")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.Roles, Definition = "Delete Range of Role", ActionType = ActionType.Delete)]
        public async Task<IActionResult> DeleteRange([FromBody] DeleteRangeCommandRequest deleteRangeCommandRequest)
        {
            DeleteRangeCommandResponse response = await _mediator.Send(deleteRangeCommandRequest);
            return Ok();
        }
    }
}
