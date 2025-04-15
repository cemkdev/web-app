using Microsoft.Extensions.DependencyInjection;
using WebAppAPI.Application.Abstractions.Hubs;
using WebAppAPI.SignalR.HubServices;

namespace WebAppAPI.SignalR
{
    public static class ServiceRegistration
    {
        public static void AddSignalRServices(this IServiceCollection collection)
        {
            collection.AddTransient<IProductHubService, ProductHubService>();
            collection.AddTransient<IOrderHubService, OrderHubService>();
            collection.AddSignalR();
        }
    }
}
