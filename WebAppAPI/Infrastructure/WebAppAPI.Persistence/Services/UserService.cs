using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.User;
using WebAppAPI.Application.Exceptions;
using WebAppAPI.Application.Helpers;
using U = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Persistence.Services
{
    public class UserService : IUserService
    {
        readonly UserManager<U.AppUser> _userManager;

        public UserService(UserManager<U.AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ListUserDto> GetAllUsersAsync(int page, int size)
        {
            List<U.AppUser> query = await _userManager.Users.ToListAsync();

            var dataPerPage = query.OrderBy(o => o.DateCreated).Skip(page * size).Take(size);

            return new()
            {
                TotalUserCount = query.Count(),
                Users = dataPerPage.Select(user => new
                {
                    Id = user.Id.ToString(),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    DateCreated = user.DateCreated,
                    DateUpdated = user.DateUpdated
                }).ToList()
            };
        }

        public async Task<CreateUserResponse> CreateAsync(CreateUser model)
        {
            U.AppUser user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null) // todo - Hata anlamsız. Anlamlı hata atanacak.
                throw new Exception();

            IdentityResult result = await _userManager.CreateAsync(new()
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = model.FirstName,
                LastName = model.LastName,
                FullName = model.FullName,
                UserName = model.Username,
                PhoneNumber = model.PhoneNumber,
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

        public async Task UpdateRefreshTokenAsync(string refreshToken, U.AppUser user, DateTime accessTokenLifetime, int refreshTokenDurationExtension)
        {
            if (user != null)
            {
                user.RefreshToken = refreshToken;
                user.RefreshTokenEndDate = accessTokenLifetime.AddSeconds(refreshTokenDurationExtension);
                await _userManager.UpdateAsync(user);
            }
            else
                throw new NotFoundUserException();
        }

        public async Task UpdatePasswordAsync(string userId, string resetToken, string newPassword)
        {
            U.AppUser user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                resetToken = resetToken.UrlDecode();

                IdentityResult result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);
                if (result.Succeeded)
                    await _userManager.UpdateSecurityStampAsync(user);
                else
                    throw new PasswordChangeFailedException();
            }
        }

        public async Task<List<string>> GetRolesByUserIdAsync(string userId)
        {
            U.AppUser user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new NotFoundUserException();

            var userRoles = await _userManager.GetRolesAsync(user);

            return userRoles.ToList();
        }

        public async Task AssignRoleToUserAsync(string userId, string[] roles)
        {
            U.AppUser user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, userRoles);

                await _userManager.AddToRolesAsync(user, roles);
            }
        }
    }
}
