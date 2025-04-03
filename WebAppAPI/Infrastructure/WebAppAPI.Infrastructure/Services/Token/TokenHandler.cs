using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebAppAPI.Application.Abstractions.Token;
using U = WebAppAPI.Domain.Entities.Identity;
using T = WebAppAPI.Application.DTOs;

namespace WebAppAPI.Infrastructure.Services.Token
{
    public class TokenHandler : ITokenHandler
    {
        readonly IConfiguration _configuration;

        public TokenHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public T.Token CreateAccessToken(int second, U.AppUser user)
        {
            T.Token token = new();

            // Security Key'in simetriğini alıyoruz.
            SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(_configuration["Token:SecurityKey"]));

            // Şifrelenmiş kimliği oluşturuyoruz.
            SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha256);

            // Oluşturulacak token ayarlarını veriyoruz.
            token.Expiration = DateTime.UtcNow.AddSeconds(second);

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

            token.RefreshToken = CreateRefreshToken();

            return token;
        }

        public string CreateRefreshToken()
        {
            byte[] number = new byte[32];
            using RandomNumberGenerator random = RandomNumberGenerator.Create();
            random.GetBytes(number);

            return Convert.ToBase64String(number);
        }
    }
}
