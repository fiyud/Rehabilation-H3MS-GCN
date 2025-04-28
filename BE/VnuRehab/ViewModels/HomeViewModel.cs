using System.Windows;
using System.Windows.Controls;
using VnuRehab.ViewModels;

namespace VnuRehab.Views
{
    public partial class HomeView : UserControl
    {
        private readonly HomeViewModel _viewModel;

        public HomeView(HomeViewModel viewModel)
        {
            InitializeComponent();
            _viewModel = viewModel;
            DataContext = _viewModel;

            // Set up event handlers for the toggle buttons
            UiPrmdToggle.Checked += UiPrmdToggle_Checked;
            KimoreToggle.Checked += KimoreToggle_Checked;
        }

        private void UiPrmdToggle_Checked(object sender, RoutedEventArgs e)
        {
            // Show UI-PRMD exercises and hide KIMORE exercises
            UiPrmdExercises.Visibility = Visibility.Visible;
            KimoreExercises.Visibility = Visibility.Collapsed;
        }

        private void KimoreToggle_Checked(object sender, RoutedEventArgs e)
        {
            // Show KIMORE exercises and hide UI-PRMD exercises
            UiPrmdExercises.Visibility = Visibility.Collapsed;
            KimoreExercises.Visibility = Visibility.Visible;
        }
    }
}
