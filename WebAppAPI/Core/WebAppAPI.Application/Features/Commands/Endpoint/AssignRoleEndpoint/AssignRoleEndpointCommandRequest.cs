using MediatR;
using WebAppAPI.Application.DTOs.Endpoint;

namespace WebAppAPI.Application.Features.Commands.Endpoint.AssignRoleEndpoint
{
    public class AssignRoleEndpointCommandRequest : IRequest<AssignRoleEndpointCommandResponse>
    {
        public List<RolesEndpointsDto> RolesEndpoints { get; set; }
        public Type? Type { get; set; }
    }
}
