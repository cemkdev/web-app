using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Application.Repositories;
using WebAppAPI.Persistence.Contexts;
using WebAppAPI.Domain.Entities;

// (!) We encountered name conflicts in the namespaces while providing the entity name to IReadRepository here.
// Therefore, the folder structure will have separate folders for the entity repositories in the file organization, but we will define their namespaces as shown below.
namespace WebAppAPI.Persistence.Repositories
{
    // This is why we implemented the ICustomerReadRepository interface;
    // - When requesting via DI, we will recieve it with ICustomerReadRepository.
    // - Additionally, ICustomerReadRepository is the signature of this class, and ReadRepository<Customer> is its implementation.
    public class ProductImageFileReadRepository : ReadRepository<ProductImageFile>, IProductImageFileReadRepository
    {
        // The base constructor expects a parameter.
        public ProductImageFileReadRepository(WebAppAPIDbContext context) : base(context)
        {
        }
    }
}
