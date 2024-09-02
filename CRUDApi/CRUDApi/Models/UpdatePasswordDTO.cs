using System.ComponentModel.DataAnnotations;

namespace CRUDApi.Models
{
    public class UpdatePasswordDTO
        //e maile göre şifre güncellemesi için yeni bir model oluşturduk.
    {
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
