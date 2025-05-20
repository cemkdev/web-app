using MediatR;

namespace WebAppAPI.Application.Features.Queries.Role.GetRoles
{
    public class GetRolesQueryRequest : IRequest<List<GetRolesQueryResponse>>
    {
    }
}
