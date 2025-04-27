using System.Windows.Controls;
using VnuRehab.ViewModels;

namespace VnuRehab.Views
{
    public partial class HomeView : UserControl
    {
        public HomeView(HomeViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }
    }
}
