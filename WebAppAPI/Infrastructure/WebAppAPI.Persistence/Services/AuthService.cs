using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.Abstractions.Token;
using WebAppAPI.Application.DTOs;
using WebAppAPI.Application.DTOs.Facebook;
using WebAppAPI.Application.Exceptions;
using U = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Persistence.Services
{
    public class AuthService : IAuthService
    {
        readonly HttpClient _httpClient;
        readonly IConfiguration _configuration;
        readonly UserManager<U.AppUser> _userManager;
        readonly ITokenHandler _tokenHandler;
        readonly SignInManager<U.AppUser> _signInManager;
        readonly IUserService _userService;

        public AuthService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            UserManager<U.AppUser> userManager,
            ITokenHandler tokenHandler,
            SignInManager<U.AppUser> signInManager,
            IUserService userService)
        {
            _httpClient = httpClientFactory.CreateClient();
            _configuration = configuration;
            _userManager = userManager;
            _tokenHandler = tokenHandler;
            _signInManager = signInManager;
            _userService = userService;
        }

        #region Internal Login
        public async Task<Token> LoginAsync(string usernameOrEmail, string password, int accessTokenLifeTime)
        {
            U.AppUser user = await _userManager.FindByNameAsync(usernameOrEmail);
            if (user == null)
                user = await _userManager.FindByEmailAsync(usernameOrEmail);

            if (user == null)
                throw new NotFoundUserException();

            SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (result.Succeeded) // Authentication succeeded!
            {
                Token token = _tokenHandler.CreateAccessToken(accessTokenLifeTime, user);
                await _userService.UpdateRefreshToken(token.RefreshToken, user, token.Expiration, 5);

                return token;
            }
            throw new AuthenticationFailedException();
        }
        #endregion

        #region External Login
        public async Task<Token> FacebookLoginAsync(string authToken, int accessTokenLifeTime)
        {
            string accessTokenResponse = await _httpClient.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_configuration["ExternalLoginSettings:Facebook:Client_ID"]}&client_secret={_configuration["ExternalLoginSettings:Facebook:Client_Secret"]}&grant_type=client_credentials");

            FacebookAccessTokenResponse? facebookAccessTokenResponse = JsonSerializer.Deserialize<FacebookAccessTokenResponse>(accessTokenResponse);
            string userAccessTokenValidation = await _httpClient.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={authToken}&access_token={facebookAccessTokenResponse?.AccessToken}");

            FacebookUserAccessTokenValidation? validation = JsonSerializer.Deserialize<FacebookUserAccessTokenValidation>(userAccessTokenValidation);

            if (validation?.Data.IsValid != null)
            {
                string userInfoResponse = await _httpClient.GetStringAsync($"https://graph.facebook.com/me?fields=first_name,last_name,name,email&access_token={authToken}");

                FacebookUserInfoResponse? userInfo = JsonSerializer.Deserialize<FacebookUserInfoResponse>(userInfoResponse);

                ExternalLoginInfo externalLoginInfo = new()
                {
                    Email = userInfo?.Email,
                    FirstName = userInfo?.FirstName,
                    LastName = userInfo?.LastName,
                    FullName = userInfo?.FullName
                };

                var info = new UserLoginInfo("FACEBOOK", validation.Data.UserId, "FACEBOOK");
                U.AppUser user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                return await CreateUserExternalAsync(user, externalLoginInfo, info, accessTokenLifeTime);
            }
            throw new Exception("Invalid external authentication.");
        }

        public async Task<Token> GoogleLoginAsync(string idToken, int accessTokenLifeTime)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { _configuration["ExternalLoginSettings:Google:Client_ID"] }
            };

            GoogleJsonWebSignature.Payload? payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            ExternalLoginInfo externalLoginInfo = new()
            {
                Email = payload?.Email,
                FirstName = payload?.GivenName,
                LastName = payload?.FamilyName,
                FullName = payload?.Name
            };

            var info = new UserLoginInfo("GOOGLE", payload.Subject, "GOOGLE");
            U.AppUser user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            return await CreateUserExternalAsync(user, externalLoginInfo, info, accessTokenLifeTime);
        }
        #endregion

        #region Helpers
        async Task<Token> CreateUserExternalAsync(U.AppUser user, ExternalLoginInfo externalLoginInfo, UserLoginInfo info, int accessTokenLifeTime)
        {
            bool result = user != null;
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(externalLoginInfo.Email);
                if (user == null)
                {
                    user = new()
                    {
                        Id = Guid.NewGuid().ToString(),
                        Email = externalLoginInfo.Email,
                        UserName = externalLoginInfo.Email,
                        FirstName = externalLoginInfo.FirstName,
                        LastName = externalLoginInfo.LastName,
                        FullName = externalLoginInfo.FullName
                    };
                    var identityResult = await _userManager.CreateAsync(user);
                    result = identityResult.Succeeded;
                }
            }

            if (result)
            {
                await _userManager.AddLoginAsync(user, info); //AspNetUserLogins                    

                Token token = _tokenHandler.CreateAccessToken(accessTokenLifeTime, user);
                await _userService.UpdateRefreshToken(token.RefreshToken, user, token.Expiration, 5);

                return token;
            }
            throw new Exception("Invalid external authentication.");
        }

        public async Task<Token> RefreshTokenLoginAsync(string refreshToken)
        {
            U.AppUser? user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user != null && user?.RefreshTokenEndDate > DateTime.UtcNow)
            {
                Token token = _tokenHandler.CreateAccessToken(15, user);
                await _userService.UpdateRefreshToken(refreshToken, user, token.Expiration, 5 * 60);
                return token;
            }
            else
                throw new NotFoundUserException();
        }

        class ExternalLoginInfo
        {
            public string? Email { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? FullName { get; set; }
        }
        #endregion
    }
}
