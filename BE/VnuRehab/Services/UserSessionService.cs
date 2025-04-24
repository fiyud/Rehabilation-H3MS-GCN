using Newtonsoft.Json;
using System;
using System.IO;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class UserSessionService
    {
        private static readonly string _filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "VnuRehab", "user.json");
        public User CurrentUser { get; private set; }
        public bool IsLoggedIn => CurrentUser != null;

        public void SaveUser(User user)
        {
            CurrentUser = user;
            Directory.CreateDirectory(Path.GetDirectoryName(_filePath));
            File.WriteAllText(_filePath, JsonConvert.SerializeObject(user));
        }

        public bool TryLoadUser(out User user)
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                user = JsonConvert.DeserializeObject<User>(json);
                if (user != null)
                {
                    CurrentUser = user;
                    return true;
                }
            }
            CurrentUser = null;
            user = null;
            return false;
        }

        public void Logout()
        {
            CurrentUser = null;
            if (File.Exists(_filePath)) File.Delete(_filePath);
        }
    }
}
