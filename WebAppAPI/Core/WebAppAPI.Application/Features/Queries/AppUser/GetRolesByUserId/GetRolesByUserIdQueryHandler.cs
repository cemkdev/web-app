using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Queries.AppUser.GetRolesByUserId
{
    public class GetRolesByUserIdQueryHandler : IRequestHandler<GetRolesByUserIdQueryRequest, List<GetRolesByUserIdQueryResponse>>
    {
        readonly IUserService _userService;
        readonly IRoleService _roleService;

        public GetRolesByUserIdQueryHandler(IUserService userService, IRoleService roleService)
        {
            _userService = userService;
            _roleService = roleService;
        }

        public async Task<List<GetRolesByUserIdQueryResponse>> Handle(GetRolesByUserIdQueryRequest request, CancellationToken cancellationToken)
        {
            var userRoles = await _userService.GetRolesByUserIdentifierAsync(request.UserId);
            var allRoles = _roleService.GetRoles();

            var result = allRoles.Select(roles => new GetRolesByUserIdQueryResponse
            {
                RoleId = roles.Key,
                RoleName = roles.Value,
                IsAssigned = userRoles.Contains(roles.Value)
            }).ToList();

            return result;
        }
    }
}
