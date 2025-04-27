using System;
using System.Windows;

namespace VnuRehab.Services
{
    public class WindowService
    {
        private readonly IServiceProvider _serviceProvider;
        public WindowService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void ShowWindow<TWindow>() where TWindow : Window
        {
            var window = _serviceProvider.GetService(typeof(TWindow)) as TWindow ?? throw new InvalidOperationException($"Could not resolve window of type {typeof(TWindow).Name}");
            window.Show();
        }

        public void CloseWindow(Window window)
        {
            window?.Close();
        }

        public void SwitchMainWindow<TWindow>() where TWindow : Window
        {
            var window = _serviceProvider.GetService(typeof(TWindow)) as TWindow ?? throw new InvalidOperationException($"Could not resolve window of type {typeof(TWindow).Name}");
            Application.Current.MainWindow?.Close();
            Application.Current.MainWindow = window;
            window.Show();
        }
    }
}
