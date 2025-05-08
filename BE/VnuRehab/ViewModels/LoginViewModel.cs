using System;
using System.Windows;
using System.Windows.Input;
using VnuRehab.Services;
using VnuRehab.Views;

namespace VnuRehab.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        private string _patientName;
        public string PatientName { get => _patientName; set => SetProperty(ref _patientName, value); }

        private string _patientId;
        public string PatientId { get => _patientId; set => SetProperty(ref _patientId, value); }

        private bool _isLoggingIn;
        public bool IsLoggingIn { get => _isLoggingIn; set => SetProperty(ref _isLoggingIn, value); }

        private readonly UserSessionService _userSessionService;
        private readonly WindowService _windowService;
        private readonly ApiService _apiService;

        public ICommand LoginCommand { get; }

        public LoginViewModel(ApiService apiService, WindowService windowService, UserSessionService userSessionService)
        {
            _apiService = apiService;
            _windowService = windowService;
            _userSessionService = userSessionService;
            LoginCommand = new RelayCommand<LoginWindow>(Login);
        }

        private async void Login(LoginWindow parameter)
        {
            if (string.IsNullOrEmpty(PatientName) || string.IsNullOrEmpty(PatientId))
            {
                MessageBox.Show("Please enter both Patient Name and Patient ID.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            IsLoggingIn = true;
            try
            {
                var user = await _apiService.LoginAsync(PatientName, PatientId);
                if (user != null)
                {
                    _userSessionService.SaveUser(user);
                    _windowService.SwitchMainWindow<MainWindow>();
                }
                else
                {
                    MessageBox.Show("Login failed. Please check your credentials.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsLoggingIn = false;
            }
        }
    }
}
