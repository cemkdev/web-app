using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Infrastructure.Services
{
    public class MailService : IMailService
    {
        readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendMessageAsync(string recipient, string subject, string body, bool isBodyHtml = true)
        {
            await SendMessageAsync(new[] { recipient }, subject, body, isBodyHtml);
        }

        public async Task SendMessageAsync(string[] recipients, string subject, string body, bool isBodyHtml = true)
        {
            MailMessage mail = new();
            foreach (var recipient in recipients)
                mail.To.Add(recipient);
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = isBodyHtml;

            mail.From = new(_configuration["Mail:Username"], "Web App Test Mail", System.Text.Encoding.UTF8);

            SmtpClient smtp = new();
            smtp.Credentials = new NetworkCredential(_configuration["Mail:Username"], _configuration["Mail:Password"]);
            smtp.Port = Convert.ToInt32(_configuration["Mail:Port"]);
            smtp.EnableSsl = Convert.ToBoolean(_configuration["Mail:EnableSsl"]);
            smtp.Host = _configuration["Mail:Host"];

            await smtp.SendMailAsync(mail);
        }
    }
}
