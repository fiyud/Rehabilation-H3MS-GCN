using System;
using System.Collections.Generic;
using System.Configuration;
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
        private static readonly string BaseUrl = ConfigurationManager.AppSettings["APIUrl"] ?? "http://localhost:8080";
        private readonly HttpClient _client;
        private readonly UserSessionService _userSessionService;
        public ApiService(UserSessionService userSessionService)
        {
            _client = new HttpClient
            {
                BaseAddress = new Uri(BaseUrl),
                DefaultRequestHeaders =
                {
                    Accept = { new MediaTypeWithQualityHeaderValue("application/json") },
                }
            };
            _userSessionService = userSessionService;
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

        public async Task<IEnumerable<Exercise>> GetExercisesAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/exercises")
            {
                Headers = { Authorization = new AuthenticationHeaderValue("Bearer", _userSessionService.CurrentUser.Id) }
            };
            var resp = await _client.SendAsync(request);
            if (resp.IsSuccessStatusCode)
            {
                var content = await resp.Content.ReadAsStringAsync();
                var exercises = JsonConvert.DeserializeObject<IEnumerable<Exercise>>(content);
                return exercises;
            }
            return null;
        }

        public async Task<bool> AddExerciseResultAsync(ExerciseType type, decimal score, TimeSpan duration)
        {
            if (_userSessionService.CurrentUser == null) throw new InvalidOperationException("User is not logged in.");
            var payload = new
            {
                Type = type,
                Score = score,
                Duration = ((decimal)duration.TotalSeconds),
            };
            var json = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, "/exercises")
            {
                Content = json,
                Headers = { Authorization = new AuthenticationHeaderValue("Bearer", _userSessionService.CurrentUser.Id) }
            };
            var resp = await _client.SendAsync(request);
            return resp.IsSuccessStatusCode;
        }

        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}
