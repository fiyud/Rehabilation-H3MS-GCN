using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Input;
using VnuRehab.Models;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class StatisticsViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;

        private ObservableCollection<Exercise> _exercises;
        public ObservableCollection<Exercise> Exercises
        { 
            get => _exercises;
            set
            {
                if (SetProperty(ref _exercises, value))
                {
                    ExercisesView = CollectionViewSource.GetDefaultView(_exercises);
                    ExercisesView.Filter = FilterExercises;
                    OnPropertyChanged(nameof(ExercisesView));
                }
            }
        }
        public ICollectionView ExercisesView { get; private set; }

        private string _searchText;
        public string SearchText
        {
            get => _searchText;
            set
            {
                if (SetProperty(ref _searchText, value))
                {
                    ExercisesView?.Refresh();
                }
            }
        }

        public ICommand ExportDataCommand { get; }

        public StatisticsViewModel(ApiService apiService)
        {
            _apiService = apiService;
            ExportDataCommand = new RelayCommand(_ => ExportToCsv());
        }

        public async Task LoadPatientData()
        {
            var result = await _apiService.GetExercisesAsync();
            Exercises = new ObservableCollection<Exercise>(result ?? new List<Exercise>());
        }

        private void ExportToCsv()
        {
            var dialog = new Microsoft.Win32.SaveFileDialog
            {
                FileName = "exercises",
                Filter = "CSV files (*.csv)|*.csv",
                DefaultExt = ".csv"
            };
            if (dialog.ShowDialog() == true)
            {
                using (var writer = new System.IO.StreamWriter(dialog.FileName))
                {
                    writer.WriteLine("Index,Exercise Type,Average Score,Duration,Submitted At");
                    foreach (var exercise in Exercises)
                    {
                        writer.WriteLine($"{exercise.Id},{exercise.Type},{exercise.Score},{exercise.Duration?.ToString("0.##")},{exercise.SubmittedAt:yyyy-MM-dd HH:mm}");
                    }
                }
            }
        }

        private bool FilterExercises(object item)
        {
            if (item is Exercise exercise)
            {
                if (string.IsNullOrEmpty(SearchText)) return true;
                return exercise.Type.ToString()
                                    .ToLowerInvariant()
                                    .Contains(SearchText.ToLowerInvariant());
            }
            return false;
        }
    }
}