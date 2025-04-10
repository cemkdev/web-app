using Microsoft.EntityFrameworkCore;
using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Application.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        DbSet<T> Table { get; }
    }
}
