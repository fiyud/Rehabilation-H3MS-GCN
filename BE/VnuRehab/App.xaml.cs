using System.Windows;
using VnuRehab.Services;
using VnuRehab.Views;

namespace VnuRehab
{
    public partial class App : Application
    {
        private readonly UserSessionService _userSessionService = new UserSessionService();
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            if (_userSessionService.TryLoadUser(out _))
            {
                new MainWindow(_userSessionService).Show();
            }
            else
            {
                new LoginWindow(_userSessionService).Show();
            }
        }
    }
}
