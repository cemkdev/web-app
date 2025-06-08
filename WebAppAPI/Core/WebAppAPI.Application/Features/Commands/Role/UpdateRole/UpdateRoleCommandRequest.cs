using MediatR;

namespace WebAppAPI.Application.Features.Commands.Role.UpdateRole
{
    public class UpdateRoleCommandRequest : IRequest<UpdateRoleCommandResponse>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsAdmin { get; set; }
    }
}
