using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace WebAppAPI.Infrastructure.Operations
{
    public static class NameOperation
    {
        public static string CharacterFormatter(string name)
        {
            name = name.ToLower();
            name = name.Replace("ç", "c")
                       .Replace("ğ", "g")
                       .Replace("ı", "i")
                       .Replace("ş", "s")
                       .Replace("ü", "u")
                       .Replace("ö", "o");
            name = name.Replace(" ", "-");
            name = Regex.Replace(name, @"[^a-z0-9\-]", ""); // Remove special characters.
            name = name.Trim('-');
            name = Regex.Replace(name, @"-+", "-");

            return name;

            //todo Burada her dönüşüm yapıldığında yeni string oluşturuluyor. Bunları daha maliyetsiz string düzenleme yöntemleri ile güncelle.
        }
    }
}
