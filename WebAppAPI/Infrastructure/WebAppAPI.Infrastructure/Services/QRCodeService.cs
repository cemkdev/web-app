using QRCoder;
using WebAppAPI.Application.Abstractions.Services;

namespace WebAppAPI.Infrastructure.Services
{
    public class QRCodeService : IQRCodeService
    {
        public byte[] GenerateQRCode(string code)
        {
            QRCodeGenerator qRCodeGenerator = new();
            QRCodeData data = qRCodeGenerator.CreateQrCode(code, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qRCode = new(data);
            byte[] byteGraphic = qRCode.GetGraphic(10, new byte[] { 84, 99, 71 }, new byte[] { 240, 240, 240 });

            return byteGraphic;
        }
    }
}
