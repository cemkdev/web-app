using MediatR;

namespace WebAppAPI.Application.Features.Queries.AppUser.GetRolesByUserId
{
    public class GetRolesByUserIdQueryRequest : IRequest<List<GetRolesByUserIdQueryResponse>>
    {
        public string UserId { get; set; }
    }
}
