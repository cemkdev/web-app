using MediatR;

namespace WebAppAPI.Application.Features.Commands.Role.DeleteRange
{
    public class DeleteRangeCommandRequest : IRequest<DeleteRangeCommandResponse>
    {
        public List<string> RoleIds { get; set; }
    }
}
