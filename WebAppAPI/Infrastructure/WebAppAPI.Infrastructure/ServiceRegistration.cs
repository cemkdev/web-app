using Microsoft.Extensions.DependencyInjection;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Abstractions.Storage;
using WebAppAPI.Application.Abstractions.Token;
using WebAppAPI.Infrastructure.Enums;
using WebAppAPI.Infrastructure.Services;
using WebAppAPI.Infrastructure.Services.Storage;
using WebAppAPI.Infrastructure.Services.Storage.Azure;
using WebAppAPI.Infrastructure.Services.Storage.Local;
using WebAppAPI.Infrastructure.Services.Token;

namespace WebAppAPI.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructureServices(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddScoped<IStorageService, StorageService>();
            serviceCollection.AddScoped<ITokenHandler, TokenHandler>();
            serviceCollection.AddScoped<IMailService, MailService>();
        }

        public static void AddStorage<T>(this IServiceCollection serviceCollection) where T : Storage, IStorage
        {
            serviceCollection.AddScoped<IStorage, T>();
        }

        public static void AddStorage(this IServiceCollection serviceCollection, StorageType storageType)
        {
            switch (storageType)
            {
                case StorageType.Local:
                    serviceCollection.AddScoped<IStorage, LocalStorage>();
                    break;
                case StorageType.Azure:
                    serviceCollection.AddScoped<IStorage, AzureStorage>();
                    break;
                case StorageType.AWS:
                    //serviceCollection.AddScoped<IStorage, AWSStorage>();
                    break;
                default:
                    serviceCollection.AddScoped<IStorage, LocalStorage>();
                    break;
            }
        }
    }
}
