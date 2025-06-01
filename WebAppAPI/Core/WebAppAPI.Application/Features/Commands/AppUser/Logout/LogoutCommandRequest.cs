using MediatR;

namespace WebAppAPI.Application.Features.Commands.AppUser.Logout
{
    public class LogoutCommandRequest : IRequest<LogoutCommandResponse>
    {
    }
}
