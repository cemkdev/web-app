using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebAppAPI.Application.Abstractions;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Abstractions.Services.Authentications;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Domain.Entities.Identity;
using WebAppAPI.Persistence.Contexts;
using WebAppAPI.Persistence.Repositories;
using WebAppAPI.Persistence.Services;

namespace WebAppAPI.Persistence
{
    public static class ServiceRegistration
    {
        // The method by which we will add services to the built-in IoC Container in the WebAPI project in the Presentation layer.
        public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            // We need to specify the database we will migrate using the Use commands to the "server" we will use.
            // But which server? -> postgresql. That's why we need to install the relevant package to this project.
            // If you execute migration commands via the dotnet CLI, you don't need this service.
            //services.AddDbContext<WebAppAPIDbContext>(options => options.UseNpgsql(Configuration.ConnectionString));
            services.AddDbContext<WebAppAPIDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("PostgreSQL")));

            services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.Password.RequiredLength = 3;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
            }).AddEntityFrameworkStores<WebAppAPIDbContext>()
            .AddDefaultTokenProviders(); // AddDefaultTokenProviders() is for using GeneratePasswordResetTokenAsync() in our AuthService.

            // Actual Table Entities Repositories
            services.AddScoped<ICustomerReadRepository, CustomerReadRepository>();
            services.AddScoped<ICustomerWriteRepository, CustomerWriteRepository>();

            services.AddScoped<IOrderReadRepository, OrderReadRepository>();
            services.AddScoped<IOrderWriteRepository, OrderWriteRepository>();

            services.AddScoped<IProductReadRepository, ProductReadRepository>();
            services.AddScoped<IProductWriteRepository, ProductWriteRepository>();

            services.AddScoped<IBasketReadRepository, BasketReadRepository>();
            services.AddScoped<IBasketWriteRepository, BasketWriteRepository>();
            services.AddScoped<IBasketItemReadRepository, BasketItemReadRepository>();
            services.AddScoped<IBasketItemWriteRepository, BasketItemWriteRepository>();

            services.AddScoped<IOrderStatusHistoryReadRepository, OrderStatusHistoryReadRepository>();
            services.AddScoped<IOrderStatusHistoryWriteRepository, OrderStatusHistoryWriteRepository>();

            services.AddScoped<IEndpointReadRepository, EndpointReadRepository>();
            services.AddScoped<IEndpointWriteRepository, EndpointWriteRepository>();

            services.AddScoped<IMenuReadRepository, MenuReadRepository>();
            services.AddScoped<IMenuWriteRepository, MenuWriteRepository>();

            // File Table Entities Repositories
            services.AddScoped<IFileReadRepository, FileReadRepository>();
            services.AddScoped<IFileWriteRepository, FileWriteRepository>();

            services.AddScoped<IProductImageFileReadRepository, ProductImageFileReadRepository>();
            services.AddScoped<IProductImageFileWriteRepository, ProductImageFileWriteRepository>();

            services.AddScoped<IInvoiceFileReadRepository, InvoiceFileReadRepository>();
            services.AddScoped<IInvoiceFileWriteRepository, InvoiceFileWriteRepository>();

            // User Table(Identity) Entities Services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IInternalAuthentication, AuthService>();
            services.AddScoped<IExternalAuthentication, AuthService>();
            services.AddScoped<IRoleService, RoleService>();

            // Endpoint - Menu Entities Services
            services.AddScoped<IEndpointService, EndpointService>();

            // Basket - Order Entities Service
            services.AddScoped<IBasketService, BasketService>();
            services.AddScoped<IOrderService, OrderService>();

            // Product Entity Service
            services.AddScoped<IProductService, ProductService>();
        }
    }
}
