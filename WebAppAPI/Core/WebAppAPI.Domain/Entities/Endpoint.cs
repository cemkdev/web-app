using WebAppAPI.Domain.Entities.Common;
using WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Domain.Entities
{
    public class Endpoint : BaseEntity
    {
        public Endpoint()
        {
            Roles = new HashSet<AppRole>();
        }

        public string ActionType { get; set; }
        public string HttpType { get; set; }
        public string Definition { get; set; }
        public string Code { get; set; }
        public bool AdminOnly { get; set; }

        public Menu Menu { get; set; }
        public ICollection<AppRole> Roles { get; set; }
    }
}
