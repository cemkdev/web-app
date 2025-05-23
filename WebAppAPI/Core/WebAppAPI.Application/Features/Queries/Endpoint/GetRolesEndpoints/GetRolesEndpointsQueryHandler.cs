using MediatR;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Application.Features.Queries.Endpoint.GetRolesEndpoints
{
    public class GetRolesEndpointsQueryHandler : IRequestHandler<GetRolesEndpointsQueryRequest, GetRolesEndpointsQueryResponse>
    {
        readonly IEndpointService _endpointService;

        public GetRolesEndpointsQueryHandler(IEndpointService endpointService)
        {
            _endpointService = endpointService;
        }

        public async Task<GetRolesEndpointsQueryResponse> Handle(GetRolesEndpointsQueryRequest request, CancellationToken cancellationToken)
        {
            var response = await _endpointService.GetRolesEndpointsAsync();
            return new()
            {
                RolesEndpoints = response
            };
        }
    }
}
