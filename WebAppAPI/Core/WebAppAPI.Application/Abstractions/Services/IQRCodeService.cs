namespace WebAppAPI.Application.Abstractions.Services
{
    public interface IQRCodeService
    {
        byte[] GenerateQRCode(string code);
    }
}
