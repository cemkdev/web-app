namespace WebAppAPI.Application.Features.Queries.AppUser.GetRolesByUserId
{
    public class GetRolesByUserIdQueryResponse
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public bool IsAssigned { get; set; }
    }
}
