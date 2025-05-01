using System.Windows.Controls;
using VnuRehab.ViewModels;

namespace VnuRehab.Views
{
    public partial class ExerciseView : UserControl
    {
        private ExerciseViewModel _viewModel;

        public ExerciseView(ExerciseViewModel viewModel)
        {
            InitializeComponent();
            _viewModel = viewModel;
            DataContext = viewModel;
        }
    }
}
