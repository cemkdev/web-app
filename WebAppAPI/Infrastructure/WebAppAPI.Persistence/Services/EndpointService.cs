using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Abstractions.Services.Configurations;
using WebAppAPI.Application.DTOs.Endpoint;
using WebAppAPI.Application.Exceptions;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;
using WebAppAPI.Domain.Entities.Identity;
using C = WebAppAPI.Application.DTOs.Configuration;

namespace WebAppAPI.Persistence.Services
{
    public class EndpointService : IEndpointService
    {
        readonly IApplicationService _applicationService;
        readonly IMenuReadRepository _menuReadRepository;
        readonly IMenuWriteRepository _menuWriteRepository;
        readonly IEndpointReadRepository _endpointReadRepository;
        readonly IEndpointWriteRepository _endpointWriteRepository;
        readonly RoleManager<AppRole> _roleManager;
        readonly UserManager<AppUser> _userManager;

        public EndpointService(
            IApplicationService applicationService,
            IMenuReadRepository menuReadRepository,
            IMenuWriteRepository menuWriteRepository,
            IEndpointReadRepository endpointReadRepository,
            IEndpointWriteRepository endpointWriteRepository,
            RoleManager<AppRole> roleManager,
            UserManager<AppUser> userManager)
        {
            _applicationService = applicationService;
            _menuReadRepository = menuReadRepository;
            _menuWriteRepository = menuWriteRepository;
            _endpointReadRepository = endpointReadRepository;
            _endpointWriteRepository = endpointWriteRepository;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task<List<RolesEndpointsDto>> GetRolesEndpointsAsync()
        {
            var roles = await _roleManager.Roles
                                .Include(r => r.Endpoints)
                                .ToListAsync();

            var endpoints = await _endpointReadRepository.Table
                                    .Include(e => e.Menu)
                                    .Include(e => e.Roles)
                                    .ToListAsync();

            var rolesEndpoints = new List<RolesEndpointsDto>();

            foreach (var role in roles)
            {
                var roleDto = new RolesEndpointsDto
                {
                    RoleId = role.Id,
                    RoleEndpoints = new List<RoleEndpoint>()
                };

                foreach (var endpoint in endpoints)
                {
                    roleDto.RoleEndpoints.Add(new RoleEndpoint
                    {
                        MenuName = endpoint.Menu.Name,
                        EndpointCode = endpoint.Code,
                        IsAuthorized = endpoint.Roles.Any(r => r.Id == role.Id)
                    });
                }

                rolesEndpoints.Add(roleDto);
            }

            return rolesEndpoints;
        }

        public async Task AssignRoleToEndpointsAsync(List<RolesEndpointsDto> rolesEndpoints, Type type) // Tüm role ve endpoint'leri alıyoruz client'tan.
        {
            var menus = await _menuReadRepository.GetAll().ToListAsync();
            var endpoints = await _endpointReadRepository.Table
                                    .Include(e => e.Menu)
                                    .Include(e => e.Roles).ToListAsync();
            var roles = await _roleManager.Roles
                                    .Include(r => r.Endpoints).ToListAsync();

            foreach (var roleEndpoints in rolesEndpoints)
            {
                AppRole role = roles.First(r => r.Id == roleEndpoints.RoleId);

                foreach (var roleEndpoint in roleEndpoints.RoleEndpoints)
                {
                    Menu? menu = menus.FirstOrDefault(m => m.Name == roleEndpoint.MenuName);
                    if (menu == null) // menu, db'de yoksa ekleniyor.
                    {
                        menu = new()
                        {
                            Name = roleEndpoint.MenuName
                        };
                        await _menuWriteRepository.AddAsync(menu);
                        await _menuWriteRepository.SaveAsync();
                        menus.Add(menu);
                    }

                    Endpoint? endpoint = endpoints.FirstOrDefault(e => e.Code == roleEndpoint.EndpointCode && e.Menu.Name == roleEndpoint.MenuName);
                    var action = _applicationService.GetAuthorizeDefinitionEndpoints(type)
                                                .FirstOrDefault(menu => menu.Name == roleEndpoint.MenuName)?
                                                .Actions.FirstOrDefault(a => a.Code == roleEndpoint.EndpointCode);

                    if (endpoint == null) // endpoint, db'de yoksa ekleniyor.
                    {


                        endpoint = new()
                        {
                            ActionType = action.ActionType.ToString(),
                            HttpType = action.HttpType,
                            Definition = action.Definition,
                            Code = action.Code,
                            AdminOnly = action.AdminOnly,
                            Menu = menu
                        };

                        await _endpointWriteRepository.AddAsync(endpoint);
                        await _endpointWriteRepository.SaveAsync();
                        endpoints.Add(endpoint);
                    }
                    else // If the endpoint exists, check for changes and update if necessary.
                    {
                        var updated = false;

                        if (endpoint.ActionType != action.ActionType.ToString())
                        {
                            endpoint.ActionType = action.ActionType.ToString();
                            updated = true;
                        }

                        if (endpoint.HttpType != action.HttpType)
                        {
                            endpoint.HttpType = action.HttpType;
                            updated = true;
                        }

                        if (endpoint.Definition != action.Definition)
                        {
                            endpoint.Definition = action.Definition;
                            updated = true;
                        }

                        if (endpoint.AdminOnly != action.AdminOnly)
                        {
                            endpoint.AdminOnly = action.AdminOnly;
                            updated = true;
                        }

                        if (updated)
                        {
                            _endpointWriteRepository.Update(endpoint);
                        }
                    }
                    // Set the endpoint-role relationship.
                    bool hasPermission = endpoint.Roles.Any(r => r.Id == role.Id);

                    if (roleEndpoint.IsAuthorized && !hasPermission)
                    {
                        endpoint.Roles.Add(role);
                    }
                    else if (!roleEndpoint.IsAuthorized && hasPermission)
                    {
                        endpoint.Roles.Remove(role);
                    }
                }
            }
            await _endpointWriteRepository.SaveAsync();
        }

        public async Task<bool> HasAccessToMenuAsync(string username, string menuName)
        {
            var filteredEndpointsByUserRoles = await FilteredEndpointsByUserRolesAsync(username);

            // Check endpoint access
            foreach (var role in filteredEndpointsByUserRoles)
            {
                foreach (var endpoint in role.RoleEndpoints)
                {
                    if (endpoint.MenuName == menuName && endpoint.IsAuthorized)
                        return true;
                }
            }
            return false;
        }

        public async Task<List<string>> GetAccessibleMenuNamesAsync(string username)
        {
            var filteredEndpointsByUserRoles = await FilteredEndpointsByUserRolesAsync(username);

            var accessibleMenus = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            // Check endpoints' accesses
            foreach (var role in filteredEndpointsByUserRoles)
            {
                foreach (var endpoint in role.RoleEndpoints)
                {
                    if (endpoint.IsAuthorized)
                        accessibleMenus.Add(endpoint.MenuName);
                }
            }
            return accessibleMenus.ToList();
        }

        #region Helpers
        public async Task<List<RolesEndpointsDto>> FilteredEndpointsByUserRolesAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                throw new NotFoundUserException();

            var userRoleNames = await _userManager.GetRolesAsync(user);

            var allRolesEndpoints = await GetRolesEndpointsAsync();

            // Filter endpoints according to current user's roles
            var userRolesEndpoints = allRolesEndpoints
                                        .Where(r => userRoleNames.Any(roleName => _roleManager.Roles.Any(dbRole => dbRole.Id == r.RoleId && dbRole.Name == roleName)))
                                        .ToList();
            return userRolesEndpoints;
        }
        #endregion
    }
}
