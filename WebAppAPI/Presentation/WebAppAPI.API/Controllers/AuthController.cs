using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebAppAPI.Application.Features.Commands.AppUser.FacebookLogin;
using WebAppAPI.Application.Features.Commands.AppUser.GoogleLogin;
using WebAppAPI.Application.Features.Commands.AppUser.LoginUser;
using WebAppAPI.Application.Features.Commands.AppUser.Logout;
using WebAppAPI.Application.Features.Commands.AppUser.PasswordReset;
using WebAppAPI.Application.Features.Commands.AppUser.RefreshTokenLogin;
using WebAppAPI.Application.Features.Commands.AppUser.VerifyResetToken;
using WebAppAPI.Application.Features.Queries.AppUser.IdentityCheck;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("identity-check")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> IdentityCheck([FromQuery] IdentityCheckQueryRequest identityCheckQueryRequest)
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized();

            IdentityCheckQueryResponse response = await _mediator.Send(identityCheckQueryRequest);
            return Ok(response);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginUserCommandRequest loginUserCommandRequest)
        {
            LoginUserCommandResponse response = await _mediator.Send(loginUserCommandRequest);
            return Ok(response);
        }

        [HttpPost("[action]")]
        [Authorize(AuthenticationSchemes = "Admin")]
        public async Task<IActionResult> RefreshTokenLogin([FromBody] RefreshTokenLoginCommandRequest refreshTokenLoginCommandRequest)
        {
            RefreshTokenLoginCommandResponse response = await _mediator.Send(refreshTokenLoginCommandRequest);
            return Ok(response);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginCommandRequest googleLoginCommandRequest)
        {
            GoogleLoginCommandResponse response = await _mediator.Send(googleLoginCommandRequest);
            return Ok(response);
        }

        [HttpPost("facebook-login")]
        public async Task<IActionResult> FacebookLogin(FacebookLoginCommandRequest facebookLoginCommandRequest)
        {
            FacebookLoginCommandResponse response = await _mediator.Send(facebookLoginCommandRequest);
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(LogoutCommandRequest logoutCommandRequest)
        {
            LogoutCommandResponse response = await _mediator.Send(logoutCommandRequest);
            return Ok(response);
        }

        [HttpPost("password-reset")]
        public async Task<IActionResult> PasswordReset([FromBody] PasswordResetCommandRequest passwordResetCommandRequest)
        {
            PasswordResetCommandResponse response = await _mediator.Send(passwordResetCommandRequest);
            return Ok(response);
        }

        [HttpPost("verify-reset-token")]
        public async Task<IActionResult> VerifyResetToken([FromBody] VerifyResetTokenCommandRequest verifyResetTokenCommandRequest)
        {
            VerifyResetTokenCommandResponse response = await _mediator.Send(verifyResetTokenCommandRequest);
            return Ok(response);
        }
    }
}
