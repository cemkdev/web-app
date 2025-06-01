using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Queries.AppUser.IdentityCheck
{
    public class IdentityCheckQueryHandler : IRequestHandler<IdentityCheckQueryRequest, IdentityCheckQueryResponse>
    {
        readonly IAuthService _authService;

        public IdentityCheckQueryHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<IdentityCheckQueryResponse> Handle(IdentityCheckQueryRequest request, CancellationToken cancellationToken)
        {
            var identityCheckResult = await _authService.IdentityCheckAsync();
            return new()
            {
                Username = identityCheckResult.Username,
                IsAuthenticated = identityCheckResult.IsAuthenticated,
                Expiration = identityCheckResult.Expiration,
                RefreshBeforeTime = identityCheckResult.RefreshBeforeTime
            };
        }
    }
}
