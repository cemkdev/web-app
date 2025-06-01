using MediatR;
using WebAppAPI.Application.Abstractions.Services.Authentications;
using WebAppAPI.Application.Exceptions;

namespace WebAppAPI.Application.Features.Commands.AppUser.LoginUser
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommandRequest, LoginUserCommandResponse>
    {
        readonly IInternalAuthentication _authService;

        public LoginUserCommandHandler(IInternalAuthentication authService)
        {
            _authService = authService;
        }

        public async Task<LoginUserCommandResponse> Handle(LoginUserCommandRequest request, CancellationToken cancellationToken)
        {
            var token = await _authService.LoginAsync(request.UsernameOrEmail, request.Password);

            if (token == null)
                throw new NotFoundUserException();
            return new();
        }
    }
}
