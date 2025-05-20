namespace WebAppAPI.Domain.Entities.Common
{
    public interface IAuditableIdentityEntity
    {
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
