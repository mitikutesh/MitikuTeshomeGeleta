using System;
using MimeKit;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Util.Store;
using MailKit.Net.Imap;
using MailKit.Security;
using Microsoft.Extensions.Hosting;
using MitikuTeshomeGeleta.Model;
using SQLitePCL;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

// using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;

namespace MitikuTeshomeGeleta.Services
{
    public interface IEmailSender
    {
        void SendEmail(Message message);
        Task SendEmailAsync(Message message);
    }
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;
        private IHostEnvironment _env;

        public EmailSender(EmailConfiguration emailConfig, IHostEnvironment env)
        {
            _emailConfig = emailConfig;
            _env = env;
        }

        public void SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);

            Send(emailMessage);
        }

        public async Task SendEmailAsync(Message message)
        {
            var mailMessage = CreateEmailMessage(message);

            await SendAsync(mailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = string.Format("<h2 style='color:red;'>{0}</h2>", message.Content) };

            if (message.Attachments != null && message.Attachments.Any())
            {
                byte[] fileBytes;
                foreach (var attachment in message.Attachments)
                {
                    using (var ms = new MemoryStream())
                    {
                        attachment.CopyTo(ms);
                        fileBytes = ms.ToArray();
                    }

                    bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                }
            }

            emailMessage.Body = bodyBuilder.ToMessageBody();
            return emailMessage;
        }

        private void Send(MimeMessage mailMessage)
        {
           
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
            
                    client.Send(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception, or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        private async Task SendAsync(MimeMessage mailMessage)
        {
            const string GMailAccount = "mitikutesh@gmail.com";

            var clientSecrets = new ClientSecrets {
                ClientId = "502872532690-iecj0kr4rbo8kdjlud2d3rb001ieg10c.apps.googleusercontent.com",
                ClientSecret = "2qMR620EatUnbjFNJq-AZhN-"
            };

            var codeFlow = new GoogleAuthorizationCodeFlow (new GoogleAuthorizationCodeFlow.Initializer {
                // Cache tokens in ~/.local/share/google-filedatastore/CredentialCacheFolder on Linux/Mac
                DataStore = new FileDataStore ("CredentialCacheFolder", false),
                Scopes = new [] { "https://mail.google.com/" },
                ClientSecrets = clientSecrets
            });

            var codeReceiver = new LocalServerCodeReceiver ();
            var authCode = new AuthorizationCodeInstalledApp (codeFlow, codeReceiver);
            var credential = await authCode.AuthorizeAsync (GMailAccount, CancellationToken.None);

            if (authCode.ShouldRequestAuthorizationCode (credential.Token))
                await credential.RefreshTokenAsync (CancellationToken.None);

            var oauth2 = new SaslMechanismOAuth2 (credential.UserId, credential.Token.AccessToken);

            using var client = new SmtpClient ();
            await client.ConnectAsync (_emailConfig.SmtpServer,  _emailConfig.Port, SecureSocketOptions.SslOnConnect);
            await client.AuthenticateAsync (oauth2);
            await client.SendAsync(mailMessage);
            await client.DisconnectAsync (true);
            // using (var client = new SmtpClient())
            // {
            //     try
            //     {
            //         if (_env.IsDevelopment())
            //         {
            //             await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, MailKit.Security.SecureSocketOptions.SslOnConnect);
            //         }
            //         else
            //         {
            //             await client.ConnectAsync(_emailConfig.SmtpServer);
            //         }
            //
            //         
            //         client.AuthenticationMechanisms.Remove("XOAUTH2");
            //         await client.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
            //
            //         await client.SendAsync(mailMessage);
            //     }
            //     catch(Exception ex)
            //     {
            //         //log an error message or throw an exception, or both.
            //         throw;
            //     }
            //     finally
            //     {
            //         await client.DisconnectAsync(true);
            //         client.Dispose();
            //     }
            // }
        }
    }
}