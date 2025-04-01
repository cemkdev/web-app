using WebAppAPI.Application.DTOs.User;
using U = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IUserService
    {
        Task<CreateUserResponse> CreateAsync(CreateUser model);
        Task UpdateRefreshToken(string refreshToken, U.AppUser user, DateTime accessTokenLifetime, int refreshTokenDurationExtension);
    }
}
