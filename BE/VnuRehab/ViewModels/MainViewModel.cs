using System;
using System.Windows;
using System.Windows.Input;
using FontAwesome.Sharp;
using VnuRehab.Models;
using VnuRehab.Services;
using VnuRehab.Views;

namespace VnuRehab.ViewModels
{
    public class MainViewModel : BaseViewModel
    {
        private User _currentUser;
        public User CurrentUser { get => _currentUser; set => SetProperty(ref _currentUser, value); }

        private string _title;
        public string Title { get => _title; set => SetProperty(ref _title, value); }

        private IconChar _icon;
        public IconChar Icon { get => _icon; set => SetProperty(ref _icon, value); }

        private readonly WindowService _windowService;
        private readonly NavigationService _navigationService;
        private readonly UserSessionService _userSessionService;
        public NavigationService Navigation => _navigationService;
        public ICommand ShowHomeViewCommand { get; }
        public ICommand ShowExerciseViewCommand { get; }
        public ICommand ShowStatisticsViewCommand { get; }
        public ICommand LogoutCommand { get; }

        public MainViewModel(WindowService windowService, NavigationService navigationService, UserSessionService userSessionService)
        {
            _windowService = windowService;
            _navigationService = navigationService;
            _userSessionService = userSessionService;
            _userSessionService.TryLoadUser(out _);
            CurrentUser = _userSessionService.CurrentUser;

            ShowHomeViewCommand = _navigationService.CreateCommand<HomeView>(view =>
            {
                Title = "Home";
                Icon = IconChar.Home;
            });
            ShowExerciseViewCommand = _navigationService.CreateCommand<ExerciseView>(view =>
            {
                Title = "Exercises";
                Icon = IconChar.Dumbbell;
            });
            ShowStatisticsViewCommand = _navigationService.CreateCommand<StatisticsView>(view =>
            {
                Title = "Statistics";
                Icon = IconChar.ChartBar;
            });
            LogoutCommand = new RelayCommand(_ => Logout());
            _navigationService.NavigateTo<HomeView>();
        }

        public void Logout()
        {
            try
            {
                _userSessionService.Logout();
                _windowService.SwitchMainWindow<LoginWindow>();
            } catch (Exception e)
            {
                MessageBox.Show($"An error occurred during logout: {e.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
