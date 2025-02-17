using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Persistence.Contexts;

namespace WebAppAPI.Persistence
{
    public static class ServiceRegistration
    {
        // The method by which we will add services to the built-in IoC Container in the WebAPI project in the Presentation layer.
        public static void AddPersistenceServices(this IServiceCollection services)
        {
            // We need to specify the database we will migrate using the Use commands to the "server" we will use.
            // But which server? -> postgresql. That's why we need to install the relevant package to this project.
            // If you execute migration commands via the dotnet CLI, you don't need this service.
            services.AddDbContext<WebAppAPIDbContext>(options => options.UseNpgsql(Configuration.ConnectionString));
        }
    }
}
