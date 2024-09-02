using System.ComponentModel.DataAnnotations;

namespace CRUDApi.Models
{
    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
