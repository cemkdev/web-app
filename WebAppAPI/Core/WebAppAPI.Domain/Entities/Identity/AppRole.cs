using Microsoft.AspNetCore.Identity;
using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Domain.Entities.Identity
{
    public class AppRole : IdentityRole<string>, IAuditableIdentityEntity
    {
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
