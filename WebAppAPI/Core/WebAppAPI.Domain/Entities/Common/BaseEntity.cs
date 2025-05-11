namespace WebAppAPI.Domain.Entities.Common
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        virtual public DateTime DateCreated { get; set; }
        virtual public DateTime DateUpdated { get; set; }
    }
}
