namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IMailService
    {
        Task SendMessageAsync(string recipient, string subject, string body, bool isBodyHtml = true);
        Task SendMessageAsync(string[] recipients, string subject, string body, bool isBodyHtml = true);
    }
}
