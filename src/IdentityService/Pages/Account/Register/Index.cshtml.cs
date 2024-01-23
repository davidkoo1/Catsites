using IdentityModel;
using IdentityService.Data;
using IdentityService.Models;
using IdentityService.Pages.Account.Register;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;


namespace IdentityService.Pages.Register
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class Index : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public Index(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }


        [BindProperty]
        public RegisterViewModel Input { get; set; }

        [BindProperty]
        public bool RegisterSuccess { get; set; }


        public IActionResult OnGet(string returnUrl)
        {
            Input = new RegisterViewModel { ReturnUrl = returnUrl };

            return Page();
        }


        public async Task<IActionResult> OnPost()
        {
            if (Input.Button != "register") return Redirect("~/");
            
            if(ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = Input.Username,
                    Email = Input.Email,
                    EmailConfirmed = true
                };

                var results = await _userManager.CreateAsync(user, Input.Password);
                if (results.Succeeded)
                {
                    await _userManager.AddClaimsAsync(user, new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, Input.FullName)
                    });

                    RegisterSuccess = true;
                }
            }
            return Page();
        }

    }
}
