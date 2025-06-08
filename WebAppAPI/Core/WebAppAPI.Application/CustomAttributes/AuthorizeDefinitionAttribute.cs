using WebAppAPI.Application.Enums;

namespace WebAppAPI.Application.CustomAttributes
{
    public class AuthorizeDefinitionAttribute : Attribute
    {
        public string Menu { get; set; }
        public string Definition { get; set; }
        public ActionType ActionType { get; set; }
        public bool AdminOnly { get; set; } = false;
    }
}
