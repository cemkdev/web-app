using System.ComponentModel.DataAnnotations.Schema;
using WebAppAPI.Domain.Entities.Common;

namespace WebAppAPI.Domain.Entities
{
    public class OrderStatusHistory : BaseEntity
    {
        public Guid OrderId { get; set; }

        public int? PreviousStatusId { get; set; }
        public OrderStatus PreviousStatus { get; set; }

        public int NewStatusId { get; set; }
        public OrderStatus NewStatus { get; set; }

        public DateTime ChangedDate { get; set; }


        [NotMapped]
        public override DateTime DateUpdated { get; set; }

        [NotMapped]
        public override DateTime DateCreated { get; set; }
    }
}
