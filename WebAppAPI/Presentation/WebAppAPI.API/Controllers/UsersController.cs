using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Features.Commands.AppUser.CreateUser;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly IMediator _mediator;
        readonly IMailService _mailService;

        public UsersController(IMediator mediator, IMailService mailService)
        {
            _mediator = mediator;
            _mailService = mailService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserCommandRequest createUserCommandRequest)
        {
            CreateUserCommandResponse response = await _mediator.Send(createUserCommandRequest);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> SendMail()
        {
            try
            {
                await _mailService.SendMessageAsync("jamsofthub@outlook.com", "Test Mail Subject", "<strong>This is a test mail and this the content.</strong>");
            }
            catch (Exception ex)
            {

                throw;
            }


            return Ok();
        }
    }
}
