using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Persistence.Contexts;

namespace WebAppAPI.Persistence
{
    // Created to execute migration commands via the Dotnet CLI.
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
