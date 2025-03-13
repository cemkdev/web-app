using System.Text.RegularExpressions;
using WebAppAPI.Infrastructure.Operations;

namespace WebAppAPI.Infrastructure.Services
{
    public class FileService
    {
        // BEKLEMEDE. YERİ DEĞİŞECEK!
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
    }
}
