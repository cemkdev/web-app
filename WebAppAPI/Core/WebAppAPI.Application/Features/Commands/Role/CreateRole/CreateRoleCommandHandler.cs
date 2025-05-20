using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Commands.Role.CreateRole
{
    public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommandRequest, CreateRoleCommandResponse>
    {
        readonly IRoleService _roleService;

        public CreateRoleCommandHandler(IRoleService roleService)
        {
            _roleService = roleService;
        }

        public async Task<CreateRoleCommandResponse> Handle(CreateRoleCommandRequest request, CancellationToken cancellationToken)
        {
            var result = await _roleService.CreateRoleAsync(request.Name);
            return new()
            {
                Succeeded = result
            };
        }
    }
}
