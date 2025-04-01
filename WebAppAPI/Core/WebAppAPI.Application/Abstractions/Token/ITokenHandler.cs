using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Token
{
    public interface ITokenHandler
    {
        T.Token CreateAccessToken(int second);
        string CreateRefreshToken();
    }
}
