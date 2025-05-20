namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IRoleService
    {
        IDictionary<string, string> GetRoles();
        Task<(string id, string name)> GetRoleByIdAsync(string id);
        Task<bool> CreateRoleAsync(string name);
        Task<bool> UpdateRoleAsync(string id, string name);
        Task<bool> DeleteRoleAsync(string id);
    }
}
