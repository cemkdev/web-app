namespace WebAppAPI.Application.Abstractions
{
    public interface IProductService
    {
        Task<byte[]> QrCodeFromProductAsync(string productId);
    }
}
