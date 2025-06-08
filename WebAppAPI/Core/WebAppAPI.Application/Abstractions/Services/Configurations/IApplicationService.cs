using WebAppAPI.Application.DTOs.Configuration;

namespace WebAppAPI.Application.Abstractions.Services.Configurations
{
    public interface IApplicationService
    {
        /// <summary>
        /// It scans all endpoints and sends them to the client before initially adding them to the database.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        List<Menu> GetAuthorizeDefinitionEndpoints(Type type);
    }
}
