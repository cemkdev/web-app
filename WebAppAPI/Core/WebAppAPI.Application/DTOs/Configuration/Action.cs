using WebAppAPI.Application.Enums;

namespace WebAppAPI.Application.DTOs.Configuration
{
    public class Action
    {
        public ActionType ActionType { get; set; }
        public string HttpType { get; set; }
        public string Definition { get; set; }
        public string Code { get; set; }
    }
}
