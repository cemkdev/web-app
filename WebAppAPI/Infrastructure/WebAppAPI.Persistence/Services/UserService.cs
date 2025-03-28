using Microsoft.AspNetCore.Identity;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.User;
using WebAppAPI.Domain.Entities.Identity;
using U = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Persistence.Services
{
    public class UserService : IUserService
    {
        readonly UserManager<U.AppUser> _userManager;

        public UserService(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<CreateUserResponse> CreateAsync(CreateUser model)
        {
            IdentityResult result = await _userManager.CreateAsync(new()
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = model.FirstName,
                LastName = model.LastName,
                FullName = model.FullName,
                UserName = model.Username,
                Email = model.Email
            }, model.Password);

            CreateUserResponse response = new() { Succeeded = result.Succeeded };

            if (result.Succeeded)
                response.Message = "The user has been successfully created.";
            else
                foreach (var error in result.Errors)
                    response.Message += $"• {error.Code}: {error.Description}";

            return response;
        }
    }
}
