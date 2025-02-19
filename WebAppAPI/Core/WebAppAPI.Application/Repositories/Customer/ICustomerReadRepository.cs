using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Domain.Entities;

// (!) We encountered name conflicts in the namespaces while providing the entity name to IReadRepository here.
// Therefore, the folder structure will have separate folders for the entity repositories in the file organization, but we will define their namespaces as shown below.
namespace WebAppAPI.Application.Repositories
{
    public interface ICustomerReadRepository : IReadRepository<Customer>
    {

    }
}
