using E = WebAppAPI.Domain.Entities;

// (!) We encountered name conflicts in the namespaces while providing the entity name to IReadRepository here.
// Therefore, the folder structure will have separate folders for the entity repositories in the file organization, but we will define their namespaces as shown below.
namespace WebAppAPI.Application.Repositories
{
    public interface IProductImageFileWriteRepository : IWriteRepository<E.ProductImageFile>
    {
    }
}
