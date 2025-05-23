namespace WebAppAPI.Application.DTOs.Endpoint
{
    public class RolesEndpointsDto
    {
        public string RoleId { get; set; }
        public List<RoleEndpoint> RoleEndpoints { get; set; }
    }

    public class RoleEndpoint
    {
        public string MenuName { get; set; }
        public string EndpointCode { get; set; }
        public bool IsAuthorized { get; set; }
    }
}
