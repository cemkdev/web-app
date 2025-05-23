using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Abstractions.Services.Configurations;
using WebAppAPI.Application.DTOs.Endpoint;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities;
using WebAppAPI.Domain.Entities.Identity;

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

        public EndpointService(
            IApplicationService applicationService,
            IMenuReadRepository menuReadRepository,
            IMenuWriteRepository menuWriteRepository,
            IEndpointReadRepository endpointReadRepository,
            IEndpointWriteRepository endpointWriteRepository,
            RoleManager<AppRole> roleManager)
        {
            _applicationService = applicationService;
            _menuReadRepository = menuReadRepository;
            _menuWriteRepository = menuWriteRepository;
            _endpointReadRepository = endpointReadRepository;
            _endpointWriteRepository = endpointWriteRepository;
            _roleManager = roleManager;
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

        public async Task AssignRoleToEndpointsAsync(List<RolesEndpointsDto> rolesEndpoints, Type type)
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
                    if (menu == null)
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
                    if (endpoint == null)
                    {
                        var action = _applicationService.GetAuthorizeDefinitionEndpoints(type)
                            .FirstOrDefault(menu => menu.Name == roleEndpoint.MenuName)?
                            .Actions.FirstOrDefault(a => a.Code == roleEndpoint.EndpointCode);

                        endpoint = new()
                        {
                            ActionType = action.ActionType.ToString(),
                            HttpType = action.HttpType,
                            Definition = action.Definition,
                            Code = action.Code,
                            Menu = menu
                        };

                        await _endpointWriteRepository.AddAsync(endpoint);
                        await _endpointWriteRepository.SaveAsync();
                        endpoints.Add(endpoint);
                    }
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
    }
}
