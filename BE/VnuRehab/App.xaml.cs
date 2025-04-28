using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using VnuRehab.Services;
using VnuRehab.ViewModels;
using VnuRehab.Views;

namespace VnuRehab
{
    public partial class App : Application
    {
        public static ServiceProvider ServiceProvider { get; private set; }
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            ServiceProvider = new ServiceCollection()
                // Services
                .AddSingleton<ApiService>()
                .AddSingleton<WindowService>()
                .AddSingleton<NavigationService>()
                .AddSingleton<UserSessionService>()
                .AddSingleton<KinectService>()
                .AddSingleton<SignalRService>()
                // View Models
                .AddTransient<MainViewModel>()
                .AddTransient<LoginViewModel>()
                .AddTransient<HomeViewModel>()
                .AddTransient<ExerciseViewModel>()
                .AddTransient<StatisticsViewModel>()
                // Views
                .AddSingleton<MainWindow>()
                .AddSingleton<LoginWindow>()
                .AddTransient<HomeView>()
                .AddTransient<ExerciseView>()
                .AddTransient<StatisticsView>()
                .BuildServiceProvider();
            var userSessionService = ServiceProvider.GetRequiredService<UserSessionService>();
            if (userSessionService.TryLoadUser(out _))
            {
                var mainWindow = ServiceProvider.GetRequiredService<MainWindow>();
                mainWindow.Show();
            }
            else
            {
                var loginWindow = ServiceProvider.GetRequiredService<LoginWindow>();
                loginWindow.Show();
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            base.OnExit(e);
            ServiceProvider?.DisposeAsync();
        }
    }
}