using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Routing;
using System.Reflection;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.CustomAttributes;

namespace WebAppAPI.API.Filters
{
    public class RolePermissionFilter : IAsyncActionFilter
    {
        readonly IUserService _userService;

        public RolePermissionFilter(IUserService userService)
        {
            _userService = userService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var username = context.HttpContext.User.Identity?.Name;

            if (!string.IsNullOrEmpty(username))
            {
                // ActionName'i bize vermesi için 'ControllerActionDescriptor' türüne as ediyoruz.
                var descriptor = context.ActionDescriptor as ControllerActionDescriptor;

                // MethodInfo ile bu descriptor üzerinden action'ın reflection tarafına da erişebiliyoruz.
                var authorizeDefinitionAttribute = descriptor?.MethodInfo.GetCustomAttribute(typeof(AuthorizeDefinitionAttribute)) as AuthorizeDefinitionAttribute;
                // Ancak direkt GetCustomAttribute'a Attribute'un tipini verince Attribute türünde geri dönüyor bize ve custom attribute'umuzun property'lerine erişemiyoruz. Yani çünkü temel oop bilgisi custom attribute'umuz bir alt Attribute türü. E haliyle bize Attribute dönerse alt tür member'larına nasıl erişelim. :)
                // Bunun için as ile dönüştürerek elde ediyoruz.
                // Şimdi artık custom attribute'umuzun property'lerine erişebiliyoruz. Aşağıdaki gibi.
                //authorizeDefinitionAttribute.ActionType

                // Ancak bu yeterli değil. Biz HttpType da tutuyoruz db'de ve yani bunu kullanıyoruz. Yani Http Attribute'u kullanıyoruz. Onu da elde etmemiz lazım.
                var httpAttribute = descriptor?.MethodInfo.GetCustomAttribute(typeof(HttpMethodAttribute)) as HttpMethodAttribute;
                // Bu da alt tür olduğundan bunu da as ile dönüştürüyoruz tabii ki. Aşağıdaki gibi elde edebiliyoruz.
                //httpAttribute.HttpMethods

                // Şimdi elde ettiğimiz bilgileri veritabanındaki Endpoints tablosundan check edeceğiz.
                // Ancak hepsini tek tek check etmemize gerek yok.
                // Biz 'HttpType', 'ActionType', 'Definition' alanlarını birleştirerek 'Code' alanına kaydediyoruz. 
                // Infrastructure.Services.Configurations -> ApplicationService -> GetAuthorizeDefinitionEndpoints() method'unda yaptığımız gibi, ++
                // ++ aynı birleştirme işlemini burada da uygulayacağız.
                var code = $"{(httpAttribute != null ? httpAttribute.HttpMethods.First() : HttpMethods.Get)}.{authorizeDefinitionAttribute.ActionType.ToString()}.{authorizeDefinitionAttribute.Definition.Replace(" ", "")}";
                // Bundan sonra artık db üzerinden check edeceğiz ve duruma göre hata fırlatacağız ya da next'leyeceğiz bu middleware'i...

                var hasRole = await _userService.HasRolePermissionAsync(username, code);

                if (!hasRole)
                    context.Result = new UnauthorizedResult();
                else
                    await next();
            }
            else
                await next(); // Herhangi bir yetki gerektirmeyen istekte bulunuluyor demektir. Devam edeceğiz...
        }
    }
}
