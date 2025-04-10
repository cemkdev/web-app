using WebAppAPI.Application.Abstractions.Services.Authentications;

namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IAuthService : IInternalAuthentication, IExternalAuthentication
    {

    }
}
