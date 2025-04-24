using FontAwesome.Sharp;
using System.Windows.Input;
using VnuRehab.Models;
using VnuRehab.Services;
using VnuRehab.Views;

namespace VnuRehab.ViewModels
{
    public class MainViewModel : BaseViewModel
    {
        private User _currentUser;
        private BaseViewModel _currentChildView;
        private string _title;
        private IconChar _icon;
        public User CurrentUser
        {
            get => _currentUser;
            set { _currentUser = value; OnPropertyChanged(nameof(CurrentUser)); }
        }
        public BaseViewModel CurrentChildView
        {
            get => _currentChildView;
            set { _currentChildView = value; OnPropertyChanged(nameof(CurrentChildView)); }
        }
        public string Title
        {
            get => _title;
            set { _title = value; OnPropertyChanged(nameof(Title)); }
        }
        public IconChar Icon
        {
            get => _icon;
            set { _icon = value; OnPropertyChanged(nameof(Icon)); }
        }

        private readonly UserSessionService _userSessionService;
        public ICommand ShowHomeViewCommand { get; }
        public ICommand ShowExerciseViewCommand { get; }
        public ICommand ShowStatisticsViewCommand { get; }

        public MainViewModel(UserSessionService userSessionService)
        {
            _userSessionService = userSessionService;
            _userSessionService.TryLoadUser(out _);
            CurrentUser = _userSessionService.CurrentUser;
            ShowHomeViewCommand = new RelayCommand<HomeView>(ShowHomeView);
            ShowExerciseViewCommand = new RelayCommand<ExerciseView>(ShowExerciseView);
            ShowStatisticsViewCommand = new RelayCommand<StatisticsView>(ShowStatisticsView);
            ShowHomeView(null);
        }

        private void ShowHomeView(HomeView view)
        {
            Title = "Home";
            Icon = IconChar.Home;
            CurrentChildView = new HomeViewModel(_userSessionService);
        }
        
        private void ShowExerciseView(ExerciseView view)
        {
            Title = "Exercises";
            Icon = IconChar.Dumbbell;
            CurrentChildView = new ExerciseViewModel(_userSessionService);
        }
        
        private void ShowStatisticsView(StatisticsView view)
        {
            Title = "Statistics";
            Icon = IconChar.ChartBar;
            CurrentChildView = new StatisticsViewModel(_userSessionService);
        }
    }
}
