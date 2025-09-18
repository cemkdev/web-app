using Microsoft.AspNetCore.Mvc.Controllers;
using System.Reflection;
using WebAppAPI.Application.CustomAttributes;

namespace WebAppAPI.API.Middlewares
{
    public class EndpointAdminCheckMiddleware
    {
        private readonly RequestDelegate _next;

        public EndpointAdminCheckMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var endpoint = context.GetEndpoint();

            if (endpoint != null)
            {
                var descriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
                if (descriptor != null)
                {
                    var authorizeAttr = descriptor.MethodInfo.GetCustomAttribute<AuthorizeDefinitionAttribute>();
                    if (authorizeAttr != null)
                    {
                        bool isAdminOnly = authorizeAttr.AdminOnly;

                        // Add adminOnly information into the response header.
                        context.Response.OnStarting(() =>
                        {
                            context.Response.Headers["X-Admin-Only"] = isAdminOnly.ToString().ToLower();
                            context.Response.Headers["Access-Control-Expose-Headers"] = "X-Admin-Only";
                            return Task.CompletedTask;
                        });

                        // You can also access it with context.Items in other places if necessary.
                        context.Items["IsAdminOnly"] = isAdminOnly;
                    }
                }
            }

            await _next(context);
        }
    }
}
