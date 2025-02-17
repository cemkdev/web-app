using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Domain.Entities;

namespace WebAppAPI.Persistence.Contexts
{
    // It will be placed in the IoC because we need to be able to access it from everywhere.
    public class WebAppAPIDbContext : DbContext
    {
        public WebAppAPIDbContext(DbContextOptions options) : base(options)
        {
            // It will process in the IoC...
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
    }
}
