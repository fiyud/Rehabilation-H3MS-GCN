using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace KinectAppAPI
{
    public class AuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IDataAccess data) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (Request.Path.StartsWithSegments("/login") || Request.Path.StartsWithSegments("/kinecthub"))
                return AuthenticateResult.NoResult();

            if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
                return AuthenticateResult.Fail("Missing Authorization Header");

            var token = authHeader.ToString();
            if (!token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                return AuthenticateResult.Fail("Invalid Authorization Header");

            var userId = token["Bearer ".Length..].Trim();
            var user = await data.GetByIdAsync(userId);

            if (user == null)
                return AuthenticateResult.Fail("Invalid User");

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.Role, user.Role.ToString())
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
    }
}
