using Microsoft.AspNetCore.Mvc;

namespace WebAppAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        readonly IConfiguration _configuration;

        public FilesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("get-base-storage-url")]
        public IActionResult GetBaseStorageUrl()
        {
            return Ok(new
            {
                Url = _configuration["BaseStorageUrl"]
            });
        }
    }
}
