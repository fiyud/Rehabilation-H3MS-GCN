using System;
using System.ComponentModel;
using System.Windows.Controls;
using System.Windows.Input;
using VnuRehab.ViewModels;

namespace VnuRehab.Services
{
    public class NavigationService : INotifyPropertyChanged
    {
        private readonly IServiceProvider _serviceProvider;
        private UserControl _currentView;
        public UserControl CurrentView
        {
            get => _currentView;
            set
            {
                _currentView = value;
                OnCurrentViewChanged();
            }
        }

        public NavigationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void NavigateTo<TView>() where TView : UserControl
        {
            var view = _serviceProvider.GetService(typeof(TView)) as UserControl
                ?? Activator.CreateInstance<TView>() // Create an instance if not registered in DI container
                ?? throw new InvalidOperationException($"Could not resolve view of type {typeof(TView).Name}");
            CurrentView = view;
        }

        public ICommand CreateCommand<TView>(Action<TView> extra = null) where TView : UserControl
        {
            return new RelayCommand<TView>(view => {
                NavigateTo<TView>();
                extra?.Invoke(view);
            });
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnCurrentViewChanged()
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(CurrentView)));
        }
    }
}
