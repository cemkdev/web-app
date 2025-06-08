using WebAppAPI.Application.DTOs.Role;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IRoleService
    {
        Task<List<RoleGetDto>> GetRolesAsync();
        Task<(string id, string name, bool isAdmin)> GetRoleByIdAsync(string id);
        Task<bool> CreateRoleAsync(string name, bool isAdmin);
        Task<bool> UpdateRoleAsync(string id, string name, bool isAdmin);
        Task<bool> DeleteRoleAsync(string id);
    }
}
