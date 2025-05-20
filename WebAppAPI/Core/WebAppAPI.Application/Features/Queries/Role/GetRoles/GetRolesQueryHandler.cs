using MediatR;
using System.Collections.Generic;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.Role;

namespace WebAppAPI.Application.Features.Queries.Role.GetRoles
{
    public class GetRolesQueryHandler : IRequestHandler<GetRolesQueryRequest, List<GetRolesQueryResponse>>
    {
        readonly IRoleService _roleService;

        public GetRolesQueryHandler(IRoleService roleService)
        {
            _roleService = roleService;
        }

        public async Task<List<GetRolesQueryResponse>> Handle(GetRolesQueryRequest request, CancellationToken cancellationToken)
        {
            var data = _roleService.GetRoles();
            var result = data.Select(kvp => new GetRolesQueryResponse
            {
                Id = kvp.Key,
                Name = kvp.Value
            }).ToList();

            return result;
        }
    }
}
