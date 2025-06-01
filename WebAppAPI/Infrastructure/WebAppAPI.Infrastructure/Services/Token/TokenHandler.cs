using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebAppAPI.Application.Abstractions.Token;
using T = WebAppAPI.Application.DTOs;
using I = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Infrastructure.Services.Token
{
    public class TokenHandler : ITokenHandler
    {
        readonly IConfiguration _configuration;
        readonly TokenValidationParameters _validationParameters;

        public TokenHandler(IConfiguration configuration, TokenValidationParameters validationParameters)
        {
            _configuration = configuration;
            _validationParameters = validationParameters;
        }

        public T.Token CreateAccessToken(I.AppUser user, bool isFromRefreshToken = false)
        {
            T.Token token = new();

            // Security Key'in simetriğini alıyoruz.
            SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(_configuration["Token:SecurityKey"]));

            // Şifrelenmiş kimliği oluşturuyoruz.
            SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha256);

            int configuredAccessTokenLifetime = Convert.ToInt32(_configuration["TokenExpirations:AccessToken"]);
            //token.Expiration = DateTime.UtcNow.AddSeconds(configuredAccessTokenLifetime);

            TimeSpan defaultAccessTokenLifetime = TimeSpan.FromSeconds(configuredAccessTokenLifetime);
            DateTime now = DateTime.UtcNow;
            DateTime expiration;
            if (isFromRefreshToken)
            {
                if (user.RefreshTokenEndDate == null || user.RefreshTokenEndDate <= now)
                    throw new SecurityTokenExpiredException("Session expired.");
                var remaining = user.RefreshTokenEndDate.Value - now;
                // Token süresi, refresh token süresinden uzun olmasın
                var finalLifetime = remaining < defaultAccessTokenLifetime ? remaining : defaultAccessTokenLifetime;
                expiration = DateTime.UtcNow.AddSeconds(finalLifetime.TotalSeconds);
            }
            else
                expiration = DateTime.UtcNow.AddSeconds(configuredAccessTokenLifetime);

            token.Expiration = expiration;

            JwtSecurityToken SecurityToken = new(
                audience: _configuration["Token:Audience"],
                issuer: _configuration["Token:Issuer"],
                expires: token.Expiration,
                notBefore: DateTime.UtcNow, // Token, üretildiği andan ne kadar zaman sonra devreye girsin demek.
                signingCredentials: signingCredentials,
                claims: new List<Claim> { new(ClaimTypes.Name, user.UserName) }
                );

            // Token oluşturucu sınıfından bir örnek alalım.
            JwtSecurityTokenHandler tokenHandler = new();
            token.AccessToken = tokenHandler.WriteToken(SecurityToken);

            return token;
        }

        public string CreateRefreshToken()
        {
            byte[] number = new byte[32];
            using RandomNumberGenerator random = RandomNumberGenerator.Create();
            random.GetBytes(number);

            return Convert.ToBase64String(number);
        }

        public async Task<ClaimsPrincipal> ValidateAccessTokenAsync(string accessToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var claimsPrincipal = tokenHandler.ValidateToken(accessToken, _validationParameters, out var validatedToken);
                return claimsPrincipal;
            }
            catch (SecurityTokenException ex)
            {
                throw new UnauthorizedAccessException("Invalid or expired token.", ex);
            }
        }

        public string? GetUsernameFromExpiredToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token); // Expiration kontrolü yapmaz, sadece parse eder.
            var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            return usernameClaim?.Value;
        }
    }
}
