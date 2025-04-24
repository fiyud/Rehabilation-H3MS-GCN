using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class StatisticsViewModel : BaseViewModel
    {
        private readonly UserSessionService _userSessionService;
        public StatisticsViewModel(UserSessionService userSessionService)
        {
            _userSessionService = userSessionService;
        }
    }
}
