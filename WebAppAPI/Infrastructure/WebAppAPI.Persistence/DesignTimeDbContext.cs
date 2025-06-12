using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using WebAppAPI.Persistence.Contexts;

namespace WebAppAPI.Persistence
{
    // Created to execute migration commands via the Dotnet CLI.
    // Normally, IConfiguration could be injected and used in .NET 7. But the project is currently on .NET 6.
    // This reads the DbContext at design time when EF operations are performed.
    // For now, avoid using CLI. Perform EF operations via Package Manager Console. It's not needed in production anyway.
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<WebAppAPIDbContext>
    {
        public WebAppAPIDbContext CreateDbContext(string[] args)
        {
            DbContextOptionsBuilder<WebAppAPIDbContext> dbContextOptionsBuilder = new();
            dbContextOptionsBuilder.UseNpgsql(Configuration.ConnectionString);

            return new(dbContextOptionsBuilder.Options);
        }
    }
}
