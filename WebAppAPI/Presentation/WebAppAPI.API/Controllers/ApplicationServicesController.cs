using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Abstractions.Services.Configurations;
using WebAppAPI.Application.Consts;
using WebAppAPI.Application.CustomAttributes;
using WebAppAPI.Application.Enums;
using WebAppAPI.Infrastructure.Services.Configurations;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Admin")]
    public class ApplicationServicesController : ControllerBase
    {
        readonly IApplicationService _applicationService;

        public ApplicationServicesController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet]
        [AuthorizeDefinition(Menu = AuthorizeDefinitionConstants.ApplicationServices, ActionType = ActionType.Read, Definition = "Get Authorize Definition Endpoints")]
        public IActionResult GetAuthorizeDefinitionEndpoints()
        {
            var data = _applicationService.GetAuthorizeDefinitionEndpoints(typeof(Program));
            return Ok(data);
        }
    }
}
