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
        private string _patientId;
        private bool _isLoggingIn;
        private readonly UserSessionService _userSessionService;
        public string PatientName
        {
            get => _patientName;
            set { _patientName = value; OnPropertyChanged(nameof(PatientName)); }
        }
        public string PatientId
        {
            get => _patientId;
            set { _patientId = value; OnPropertyChanged(nameof(PatientId)); }
        }
        public bool IsLoggingIn
        {
            get => _isLoggingIn;
            set { _isLoggingIn = value; OnPropertyChanged(nameof(IsLoggingIn)); }
        }

        public ICommand LoginCommand { get; }

        public LoginViewModel(UserSessionService userSessionService)
        {
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
                var user = await ApiService.LoginAsync(PatientName, PatientId);
                if (user != null)
                {
                    _userSessionService.SaveUser(user);
                    var mainWindow = new MainWindow(_userSessionService);
                    mainWindow.Show();
                    Application.Current.MainWindow.Close();
                    Application.Current.MainWindow = mainWindow;
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
