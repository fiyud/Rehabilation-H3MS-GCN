using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class ApiService : IDisposable
    {
        private const string BaseUrl = "http://localhost:8080";
        private readonly HttpClient _client;
        public ApiService()
        {
            _client = new HttpClient
            {
                BaseAddress = new Uri(BaseUrl),
                DefaultRequestHeaders =
                {
                    Accept = { new MediaTypeWithQualityHeaderValue("application/json") },
                }
            };
        }

        public async Task<User> LoginAsync(string username, string id)
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

        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}
