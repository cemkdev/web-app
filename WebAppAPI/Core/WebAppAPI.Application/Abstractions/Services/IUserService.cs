using WebAppAPI.Application.DTOs.User;
using I = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IUserService
    {
        Task<CreateUserResponse> CreateAsync(CreateUser model);
        Task UpdateRefreshToken(string refreshToken, I.AppUser user, DateTime accessTokenLifetime, int refreshTokenDurationExtension);
    }
}
