using Microsoft.Extensions.Configuration;

namespace WebAppAPI.Persistence
{
    // This is no longer in use. We are now utilizing secrets,
    // and adding them here would deprive us of IConfiguration's benefits,
    // making this approach unsuitable for best practices.
    static class Configuration
    {
        public static string ConnectionString
        {
            get
            {
                ConfigurationManager configurationManager = new();
                configurationManager.SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../Presentation/WebAppAPI.API"));
                configurationManager.AddJsonFile("appsettings.json");

                return configurationManager.GetConnectionString("PostgreSQL");
            }
        }
    }
}
