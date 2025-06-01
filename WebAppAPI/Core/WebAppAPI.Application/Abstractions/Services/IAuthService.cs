using WebAppAPI.Application.Abstractions.Services.Authentications;
using WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IAuthService : IInternalAuthentication, IExternalAuthentication
    {
        Task PasswordResetAsync(string email);
        Task<bool> VerifyResetTokenAsync(string resetToken, string userId);
        Task<IdentityCheckDto> IdentityCheckAsync();
        Task LogoutAsync();
    }
}
