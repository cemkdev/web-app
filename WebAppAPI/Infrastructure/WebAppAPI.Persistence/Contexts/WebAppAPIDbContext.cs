using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebAppAPI.Domain.Entities;
using WebAppAPI.Domain.Entities.Common;
using WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Persistence.Contexts
{
    // It will be placed in the IoC because we need to be able to access it from everywhere.
    public class WebAppAPIDbContext : IdentityDbContext<AppUser, AppRole, string>
    {
        public WebAppAPIDbContext(DbContextOptions options) : base(options)
        {
            // It will process in the IoC...
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Domain.Entities.File> Files { get; set; }
        public DbSet<ProductImageFile> ProductImageFiles { get; set; }
        public DbSet<InvoiceFile> InvoiceFiles { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Order>()
                .HasKey(b => b.Id);

            builder.Entity<Basket>()
                .HasOne(b => b.Order)
                .WithOne(o => o.Basket)
                .HasForeignKey<Order>(b => b.Id);

            base.OnModelCreating(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var data = ChangeTracker
                .Entries<BaseEntity>();

            foreach (var item in data)
            {
                var _ = item.State switch
                {
                    EntityState.Added => item.Entity.DateCreated = DateTime.UtcNow,
                    EntityState.Modified => item.Entity.DateUpdated = DateTime.UtcNow,
                    _ => DateTime.UtcNow
                };
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
