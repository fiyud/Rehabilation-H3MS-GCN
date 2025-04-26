using System.Windows.Controls;
using VnuRehab.ViewModels;

namespace VnuRehab.Views
{
    public partial class ExerciseView : UserControl
    {
        public ExerciseView(ExerciseViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }
    }
}
