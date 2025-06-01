using System.Security.Claims;
using I = WebAppAPI.Domain.Entities.Identity;
using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Token
{
    public interface ITokenHandler
    {
        T.Token CreateAccessToken(I.AppUser appUser, bool isFromRefreshToken = false);
        string CreateRefreshToken();
        Task<ClaimsPrincipal> ValidateAccessTokenAsync(string accessToken);

        string? GetUsernameFromExpiredToken(string token);
    }
}
