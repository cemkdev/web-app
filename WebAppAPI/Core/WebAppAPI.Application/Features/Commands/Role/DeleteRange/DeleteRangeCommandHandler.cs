using MediatR;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Repositories;

namespace WebAppAPI.Application.Features.Commands.Role.DeleteRange
{
    public class DeleteRangeCommandHandler : IRequestHandler<DeleteRangeCommandRequest, DeleteRangeCommandResponse>
    {
        readonly IRoleService _roleService;

        public DeleteRangeCommandHandler(IRoleService roleService)
        {
            _roleService = roleService;
        }

        public async Task<DeleteRangeCommandResponse> Handle(DeleteRangeCommandRequest request, CancellationToken cancellationToken)
        {
            foreach (var RemovingRoleId in request.RoleIds)
            {
                await _roleService.DeleteRoleAsync(RemovingRoleId);
            }
            return new(); // todo hatalı durumlar hiç handle edilmedi!
        }
    }
}
