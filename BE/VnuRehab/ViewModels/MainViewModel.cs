using FontAwesome.Sharp;
using System.Windows.Controls;
using System.Windows.Input;
using VnuRehab.Models;
using VnuRehab.Services;
using VnuRehab.Views;

namespace VnuRehab.ViewModels
{
    public class MainViewModel : BaseViewModel
    {
        private User _currentUser;
        private string _title;
        private IconChar _icon;
        public User CurrentUser
        {
            get => _currentUser;
            set => SetProperty(ref _currentUser, value);
        }
        public string Title
        {
            get => _title;
            set => SetProperty(ref _title, value);
        }
        public IconChar Icon
        {
            get => _icon;
            set => SetProperty(ref _icon, value);
        }

        private readonly NavigationService _navigationService;
        private readonly UserSessionService _userSessionService;
        public NavigationService Navigation => _navigationService;
        public ICommand ShowHomeViewCommand { get; }
        public ICommand ShowExerciseViewCommand { get; }
        public ICommand ShowStatisticsViewCommand { get; }

        public MainViewModel(NavigationService navigationService, UserSessionService userSessionService)
        {
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
            _navigationService.NavigateTo<HomeView>();
        }
    }
}
