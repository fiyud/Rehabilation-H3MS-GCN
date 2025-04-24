using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public static class ApiService
    {
        private static readonly string _baseUrl = "http://localhost:8080";
        private static readonly HttpClient _client = new HttpClient();
        static ApiService()
        {
            _client.BaseAddress = new Uri(_baseUrl);
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public static async Task<User> LoginAsync(string username, string id)
        {
            var payload = new { Username = username, Id = id };
            var json = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var resp = await _client.PostAsync("/login", json);
            if (resp.IsSuccessStatusCode)
            {
                var content = await resp.Content.ReadAsStringAsync();
                var user = JsonConvert.DeserializeObject<User>(content);
                return user;
            }
            return null;
        }
    }
}
