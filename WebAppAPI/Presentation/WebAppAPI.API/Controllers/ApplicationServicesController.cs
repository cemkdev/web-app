using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Abstractions.Services.Configurations;
using WebAppAPI.Application.Consts;
using WebAppAPI.Application.CustomAttributes;
using WebAppAPI.Application.Enums;
using WebAppAPI.Domain.Constants;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = AuthSchemes.Authenticated)]
    public class ApplicationServicesController : ControllerBase
    {
        readonly IApplicationService _applicationService;

        public ApplicationServicesController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet("get-authorize-definition-endpoints")]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.ApplicationServices, Definition = "Get Authorize Definition Endpoints", ActionType = ActionType.Read, AdminOnly = true)]
        public IActionResult GetAuthorizeDefinitionEndpoints()
        {
            var data = _applicationService.GetAuthorizeDefinitionEndpoints(typeof(Program));
            return Ok(data);
        }
    }
}
