using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebAppAPI.Application.Services;
using WebAppAPI.Infrastructure.Operations;

namespace WebAppAPI.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<bool> CopyFileAsync(string path, IFormFile file)
        {
            try
            {
                await using FileStream fileStream = new(path, FileMode.Create, FileAccess.Write, FileShare.None, 1024 * 1024, useAsync: false);

                await file.CopyToAsync(fileStream);
                await fileStream.FlushAsync();

                return true;
            }
            catch (Exception ex)
            {
                //todo log!
                throw ex;
            }
        }

        async Task<string> FileRenameAsync(string path, string fileName, bool isFirst = true)
        {
            string newFileName = await Task.Run<string>(async () =>
           {
               string extension = Path.GetExtension(fileName);
               string pureName = Path.GetFileNameWithoutExtension(fileName);

               string newFileName = $"{NameOperation.CharacterFormatter(pureName)}{extension}";
               if (string.IsNullOrEmpty(newFileName))
                   newFileName = "invalid-name";

               if (!isFirst) // if it is recurring.
               {
                   string updatedPureName = Path.GetFileNameWithoutExtension(newFileName);

                   string dash = "-";
                   int startIndexOfLastDash = updatedPureName.LastIndexOf(dash);

                   if (startIndexOfLastDash == -1) // There is no dash in the File Name. Just add "-1" at the end. Because it is the first recursive File Name.
                       newFileName = $"{updatedPureName}{dash}1{extension}";
                   else
                   {
                       string fromLastDashToEnd = updatedPureName.Substring(startIndexOfLastDash); // Get string from last dash to the end in the File Name.

                       string pattern = @".*-([1-9][0-9]*)$";
                       bool isMatch = Regex.IsMatch(fromLastDashToEnd, pattern);
                       if (isMatch) // if "-[number]" is exists after File Name like "car-1" or "book-99" increase this [number].
                       {
                           int num = int.Parse(updatedPureName.Substring((startIndexOfLastDash + dash.Length)));
                           num++;
                           updatedPureName = updatedPureName.Remove(startIndexOfLastDash + dash.Length);
                           newFileName = $"{updatedPureName}{num}{extension}";
                       }
                       else // if "-[something]" is exists after File Name but this '[something]' is not match, just add "-1" at the end. Because it is the first recursive File Name.
                           newFileName = $"{updatedPureName}{dash}1{extension}";
                   }
               }
               if (File.Exists($"{path}\\{newFileName}"))
                   return await FileRenameAsync(path, newFileName, false);
               else
                   return newFileName;
           });

            return newFileName;
        }

        public async Task<List<(string fileName, string path)>> UploadAsync(string path, IFormFileCollection files)
        {
            string uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, path);

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            List<(string fileName, string path)> data = new();
            List<bool> results = new();
            foreach (IFormFile file in files)
            {
                string fileNewName = await FileRenameAsync(uploadPath, file.FileName);
                bool result = await CopyFileAsync($"{uploadPath}\\{fileNewName}", file);

                data.Add((fileNewName, $"{path}\\{fileNewName}"));
                results.Add(result);
            }

            if (results.TrueForAll(r => r.Equals(true)))
                return data;

            return null;

            //todo Eğer ki yukarıdaki if geçerli değilse, burada, dosyaların sunucuda yüklenirken hata alındığına dair uyarıcı bir exception oluşturulup fırlatılması gerekiyor.
        }
    }
}
