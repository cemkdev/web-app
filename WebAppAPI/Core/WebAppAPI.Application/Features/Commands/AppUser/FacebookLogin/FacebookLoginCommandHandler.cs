using MediatR;
using WebAppAPI.Application.Abstractions.Services.Authentications;

namespace WebAppAPI.Application.Features.Commands.AppUser.FacebookLogin
{
    public class FacebookLoginCommandHandler : IRequestHandler<FacebookLoginCommandRequest, FacebookLoginCommandResponse>
    {
        readonly IExternalAuthentication _authService;

        public FacebookLoginCommandHandler(IExternalAuthentication authService)
        {
            _authService = authService;
        }

        public async Task<FacebookLoginCommandResponse> Handle(FacebookLoginCommandRequest request, CancellationToken cancellationToken)
        {
            var token = await _authService.FacebookLoginAsync(request.AuthToken, 15 * 60);

            return new()
            {
                Token = token
            };
        }
    }
}
