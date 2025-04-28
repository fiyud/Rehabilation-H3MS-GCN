using System.Collections.ObjectModel;
using VnuRehab.Models;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class StatisticsViewModel : BaseViewModel
    {
        private readonly UserSessionService _userSessionService;

        public ObservableCollection<PatientStatisticsItem> Patients { get; } = new ObservableCollection<PatientStatisticsItem>();

        public StatisticsViewModel(UserSessionService userSessionService)
        {
            _userSessionService = userSessionService;
            LoadPatientData();
        }

        private void LoadPatientData()
        {
            // Sample data - replace with actual data loading logic
            Patients.Add(new PatientStatisticsItem
            {
                Id = "P001",
                Name = "John Doe",
                Age = 45,
                Address = "123 Main St",
                Phone = "555-1234",
                ExerciseOptions = new ObservableCollection<string> { "Exercise1", "Exercise2", "Exercise3" },
                SelectedExercise = "Exercise1"
            });

            Patients.Add(new PatientStatisticsItem
            {
                Id = "P002",
                Name = "Jane Smith",
                Age = 38,
                Address = "456 Park Ave",
                Phone = "555-5678",
                ExerciseOptions = new ObservableCollection<string> { "Exercise1", "Exercise2", "Exercise3" },
                SelectedExercise = "Exercise2"
            });

            Patients.Add(new PatientStatisticsItem
            {
                Id = "P003",
                Name = "Michael Johnson",
                Age = 52,
                Address = "789 Oak Rd",
                Phone = "555-9012",
                ExerciseOptions = new ObservableCollection<string> { "Exercise1", "Exercise2", "Exercise3" },
                SelectedExercise = "Exercise3"
            });

            Patients.Add(new PatientStatisticsItem
            {
                Id = "P004",
                Name = "Sarah Williams",
                Age = 29,
                Address = "321 Elm St",
                Phone = "555-3456",
                ExerciseOptions = new ObservableCollection<string> { "Exercise1", "Exercise2", "Exercise3" },
                SelectedExercise = "Exercise1"
            });
        }

    }

    public class PatientStatisticsItem : BaseViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public ObservableCollection<string> ExerciseOptions { get; set; } = new ObservableCollection<string>();

        private string _selectedExercise;
        public string SelectedExercise
        {
            get => _selectedExercise;
            set => SetProperty(ref _selectedExercise, value);
        }
    }
}