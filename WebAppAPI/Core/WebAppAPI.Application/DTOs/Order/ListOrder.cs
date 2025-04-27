namespace WebAppAPI.Application.DTOs.Order
{
    public class ListOrder
    {
        public string Id { get; set; }
        public string OrderCode { get; set; }
        public string UserName { get; set; }
        public float TotalPrice { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
