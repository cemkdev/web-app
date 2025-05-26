using I = WebAppAPI.Domain.Entities.Identity;
using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Token
{
    public interface ITokenHandler
    {
        T.Token CreateAccessToken(int minutes, I.AppUser appUser);
        string CreateRefreshToken();
    }
}
