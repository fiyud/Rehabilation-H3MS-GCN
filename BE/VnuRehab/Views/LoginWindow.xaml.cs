using System.Windows;
using System.Windows.Input;
using VnuRehab.Services;
using VnuRehab.ViewModels;

namespace VnuRehab.Views
{
    public partial class LoginWindow : Window
    {
        public LoginWindow(UserSessionService userSessionService)
        {
            InitializeComponent();
            DataContext = new LoginViewModel(userSessionService);
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                DragMove();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }
    }
}
