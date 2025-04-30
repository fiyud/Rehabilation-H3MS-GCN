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

        }

     
    }
}
