using Microsoft.AspNetCore.Identity;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Persistence.Services
{
    public class RoleService : IRoleService
    {
        readonly RoleManager<AppRole> _roleManager;

        public RoleService(RoleManager<AppRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public IDictionary<string, string> GetRoles()
        {
            return _roleManager.Roles.OrderBy(r => r.DateCreated).ToDictionary(role => role.Id, role => role.Name);
        }

        public async Task<(string id, string name)> GetRoleByIdAsync(string id)
        {
            AppRole role = await _roleManager.FindByIdAsync(id);
            string name = await _roleManager.GetRoleNameAsync(role);
            return (id, name);
        }

        public async Task<bool> CreateRoleAsync(string name)
        {
            IdentityResult result = await _roleManager.CreateAsync(new() { Id = Guid.NewGuid().ToString(), Name = name });
            return result.Succeeded;
        }

        public async Task<bool> UpdateRoleAsync(string id, string name)
        {
            AppRole role = await _roleManager.FindByIdAsync(id);
            role.Name = name;
            IdentityResult result = await _roleManager.UpdateAsync(role);
            return result.Succeeded;
        }

        public async Task<bool> DeleteRoleAsync(string id)
        {
            AppRole role = await _roleManager.FindByIdAsync(id);
            IdentityResult result = await _roleManager.DeleteAsync(role);
            return result.Succeeded;
        }
    }
}
