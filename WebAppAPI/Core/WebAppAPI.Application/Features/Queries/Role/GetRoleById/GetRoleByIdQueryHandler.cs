using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Queries.Role.GetRoleById
{
    public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQueryRequest, GetRoleByIdQueryResponse>
    {
        readonly IRoleService _roleService;

        public GetRoleByIdQueryHandler(IRoleService roleService)
        {
            _roleService = roleService;
        }

        public async Task<GetRoleByIdQueryResponse> Handle(GetRoleByIdQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _roleService.GetRoleByIdAsync(request.Id);
            return new()
            {
                Id = data.id,
                Name = data.name
            };
        }
    }
}
