using WebAppAPI.Application.DTOs.User;
using I = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IUserService
    {
        Task<ListUserDto> GetAllUsersAsync(int page, int size);
        Task<CreateUserResponse> CreateAsync(CreateUser model);
        Task UpdateRefreshTokenAsync(string refreshToken, I.AppUser user, DateTime accessTokenLifetime, int refreshTokenDurationExtension);
        Task UpdatePasswordAsync(string userId, string resetToken, string newPassword);

        Task<List<string>> GetRolesByUserIdAsync(string userId);
        Task AssignRoleToUserAsync(string userId, string[] roles);
    }
}
