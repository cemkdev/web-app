using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs;

namespace WebAppAPI.Infrastructure.Services
{
    public class MailService : IMailService
    {
        readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendMailAsync(string recipient, string subject, string body, bool isBodyHtml = true)
        {
            await SendMailAsync(new[] { recipient }, subject, body, isBodyHtml);
        }

        public async Task SendMailAsync(string[] recipients, string subject, string body, bool isBodyHtml = true)
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

        public async Task SendPasswordResetMailAsync(string recipient, string userId, string firstName, string resetToken)
        {
            string appName = _configuration["ResetMail:AppName"];
            string subject = _configuration["ResetMail:PasswordResetSubject"];
            var resetLink = $"{_configuration["AngularClientUrl"]}/password-update/{userId}/{resetToken}";
            string emailBody = BuildPasswordResetEmail(firstName, resetLink, appName);

            await SendMailAsync(recipient, subject, emailBody);
        }

        #region Helpers
        public string BuildPasswordResetEmail(string firstName, string resetLink, string appName)
        {
            var sb = new StringBuilder();

            sb.AppendLine($"<p>Hello {firstName},</p>");
            sb.AppendLine("<p>We received a request to reset the password for your account associated with this email address.</p>");
            sb.AppendLine("<p>If you made this request, please click the button below to set a new password:</p>");
            sb.AppendLine($@"<p>
                                <a target='_blank' href='{resetLink}' style='display: inline-block; padding: 10px 20px; 
                                background-color: rgb(38, 73, 138); color: white; text-decoration: none; 
                                border-radius: 0.375rem;'>Reset Password</a>
                            </p>");
            sb.AppendLine("<p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>");
            sb.AppendLine($"<p><a href='{resetLink}'>{resetLink}</a></p>");
            sb.AppendLine("<p>This link will expire in 30 minutes for your security.</p>");
            sb.AppendLine("<p>If you did not request a password reset, please ignore this email. Your current password will remain unchanged.</p>");
            sb.AppendLine("<br/>");
            sb.AppendLine($"<p>Best regards,<br/><strong>The {appName} Team</strong></p>");

            return sb.ToString();
        }
        #endregion
    }
}
