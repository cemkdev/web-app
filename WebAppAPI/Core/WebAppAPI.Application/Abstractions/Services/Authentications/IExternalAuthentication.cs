using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Services.Authentications
{
    public interface IExternalAuthentication
    {
        Task<T.Token> FacebookLoginAsync(string authToken, int accessTokenLifeTime);
        Task<T.Token> GoogleLoginAsync(string idToken, int accessTokenLifeTime);
    }
}
