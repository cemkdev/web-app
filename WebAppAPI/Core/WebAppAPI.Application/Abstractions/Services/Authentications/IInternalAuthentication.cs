using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Application.Abstractions.Services.Authentications
{
    public interface IInternalAuthentication
    {
        Task<T.Token> LoginAsync(string usernameOrEmail, string password, int accessTokenLifeTime);
    }
}
