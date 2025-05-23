using WebAppAPI.Application.DTOs.Endpoint;

namespace WebAppAPI.Application.Features.Queries.Endpoint.GetRolesEndpoints
{
    public class GetRolesEndpointsQueryResponse
    {
        public List<RolesEndpointsDto> RolesEndpoints { get; set; }
    }
}
