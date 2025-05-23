using WebAppAPI.Application.DTOs.Endpoint;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IEndpointService
    {
        public Task<List<RolesEndpointsDto>> GetRolesEndpointsAsync();
        public Task AssignRoleToEndpointsAsync(List<RolesEndpointsDto> rolesEndpoints, Type type);
    }
}
