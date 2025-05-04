namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IMailService
    {
        Task SendMailAsync(string recipient, string subject, string body, bool isBodyHtml = true);
        Task SendMailAsync(string[] recipients, string subject, string body, bool isBodyHtml = true);
        Task SendPasswordResetMailAsync(string recipient, string userId, string firstName, string resetToken);
    }
}
