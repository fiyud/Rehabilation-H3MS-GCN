using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class HomeViewModel : BaseViewModel
    {
        private readonly UserSessionService _userSessionService;
        public HomeViewModel(UserSessionService userSessionService)
        {
            _userSessionService = userSessionService;
        }
    }
}
