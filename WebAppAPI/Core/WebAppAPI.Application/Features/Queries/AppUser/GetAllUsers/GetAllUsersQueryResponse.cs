namespace WebAppAPI.Application.Features.Queries.AppUser.GetAllUsers
{
    public class GetAllUsersQueryResponse
    {
        public int TotalUserCount { get; set; }
        public object Users { get; set; }
    }
}
