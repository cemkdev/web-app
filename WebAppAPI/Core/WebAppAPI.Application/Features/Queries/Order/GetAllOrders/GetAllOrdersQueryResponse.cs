using WebAppAPI.Application.DTOs.Order;

namespace WebAppAPI.Application.Features.Queries.Order.GetAllOrders
{
    public class GetAllOrdersQueryResponse
    {
        //public string Id { get; set; }
        //public string OrderCode { get; set; }
        //public string UserName { get; set; }
        //public float TotalPrice { get; set; }
        //public DateTime DateCreated { get; set; }

        public int TotalOrderCount { get; set; }
        public object Orders { get; set; }
    }
}
