﻿using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Domain.Enums;

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
            // if "Mail" property is empty in appsettings.
            if (string.IsNullOrWhiteSpace(_configuration["Mail:Username"]) ||
                string.IsNullOrWhiteSpace(_configuration["Mail:Password"]) ||
                string.IsNullOrWhiteSpace(_configuration["Mail:Port"]) ||
                string.IsNullOrWhiteSpace(_configuration["Mail:EnableSsl"]) ||
                string.IsNullOrWhiteSpace(_configuration["Mail:Host"]))
            {
                return;
            }

            MailMessage mail = new();
            foreach (var recipient in recipients)
                mail.To.Add(recipient);
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = isBodyHtml;

            mail.From = new(_configuration["Mail:Username"], $"{_configuration["EMailDisplayNames:AppName"]} Team", System.Text.Encoding.UTF8);

            SmtpClient smtp = new();
            smtp.Credentials = new NetworkCredential(_configuration["Mail:Username"], _configuration["Mail:Password"]);
            smtp.Port = Convert.ToInt32(_configuration["Mail:Port"]);
            smtp.EnableSsl = Convert.ToBoolean(_configuration["Mail:EnableSsl"]);
            smtp.Host = _configuration["Mail:Host"];

            await smtp.SendMailAsync(mail);
        }

        public async Task SendPasswordResetMailAsync(string recipient, string userId, string firstName, string resetToken)
        {
            string appName = _configuration["EMailDisplayNames:AppName"];
            string subject = _configuration["EMailDisplayNames:PasswordResetSubject"];
            var resetLink = $"{_configuration["AngularClientUrl"]}/password-update/{userId}/{resetToken}";
            string emailBody = BuildPasswordResetEmail(firstName, resetLink, appName);

            await SendMailAsync(recipient, subject, emailBody);
        }

        public async Task SendOrderStatusUpdateMailAsync(string recipient, string orderCode, OrderStatusEnum newStatus, DateTime statusChangedDate, string firstName)
        {
            string? defaultSubject = _configuration["EMailDisplayNames:OrderStatusUpdateSubject"];
            string? subject = newStatus switch
            {
                OrderStatusEnum.Pending => "We've Received Your Order!",
                OrderStatusEnum.Approved => "Your Order Has Been Approved!",
                OrderStatusEnum.Shipping => "Good News! Your Order Is on the Way",
                OrderStatusEnum.Delivered => "Your Order Has Been Delivered 🎉",
                OrderStatusEnum.Cancelled => "Your Order Has Been Cancelled",
                _ => defaultSubject
            };

            string appName = _configuration["EMailDisplayNames:AppName"];
            string emailBody = BuildOrderStatusUpdateEmail(firstName, orderCode, newStatus, statusChangedDate, appName);

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
        public string BuildOrderStatusUpdateEmail(string firstName, string orderCode, OrderStatusEnum newStatus, DateTime statusChangedDate, string appName)
        {
            var sb = new StringBuilder();

            sb.AppendLine($"<html>");
            sb.AppendLine($"<body style='font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;'>");
            sb.AppendLine($"  <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;'>");
            sb.AppendLine($"    <h2 style='color: #007bff;'>Hello {firstName},</h2>");

            switch (newStatus)
            {
                case OrderStatusEnum.Cancelled:
                    sb.AppendLine($"    <p>We're sorry to inform you that your order <strong>#{orderCode}</strong> has been <strong>cancelled</strong>. If you have any questions, feel free to contact our support team.</p>");
                    break;
                case OrderStatusEnum.Pending:
                    sb.AppendLine($"    <p>Your order <strong>#{orderCode}</strong> has been received and is currently <strong>awaiting approval</strong>.</p>");
                    break;
                case OrderStatusEnum.Approved:
                    sb.AppendLine($"    <p>Your order <strong>#{orderCode}</strong> has been <strong>approved</strong>. We’ll notify you when it is shipped.</p>");
                    break;
                case OrderStatusEnum.Shipping:
                    sb.AppendLine($"    <p>Your order <strong>#{orderCode}</strong> is now <strong>on its way</strong>. You’ll receive it soon!</p>");
                    break;
                case OrderStatusEnum.Delivered:
                    sb.AppendLine($"    <p>Your order <strong>#{orderCode}</strong> has been <strong>delivered</strong>. We hope you enjoy your purchase!</p>");
                    break;
                default:
                    sb.AppendLine($"    <p>The status of your order <strong>#{orderCode}</strong> has been updated to <strong>{Enum.GetName(typeof(OrderStatusEnum), newStatus)}</strong>.</p>");
                    break;
            }
            sb.AppendLine($"    <p>Status updated on: <strong>{statusChangedDate:MMMM dd, yyyy h:mm tt}</strong></p>");
            sb.AppendLine($"    <p>Thanks for shopping with us.<br/>");
            sb.AppendLine($"    — The {appName} Team</p>");
            sb.AppendLine($"  </div>");
            sb.AppendLine($"</body>");
            sb.AppendLine($"</html>");

            return sb.ToString();
        }
        #endregion
    }
}
