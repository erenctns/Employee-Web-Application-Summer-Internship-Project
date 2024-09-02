using CRUDApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace CRUDApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]

    //USER LOGİN İŞLEMLERİNİ BURADA YAPICAZ
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext dbContext;
        private readonly IConfiguration configuration; // JWT TOKEN KISMI İÇİN 
        public UsersController(MyDbContext dbContext , IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
            
        }
        //REGISTRATION KISMI(KAYIT KISMI)
        [AllowAnonymous]
        [HttpPost]
        [Route("Registration")]
        public IActionResult Registration(UserDTO userDTO)
        {
            if (!ModelState.IsValid)  //Modelin geçerli olup olmadığını kontrol eder.
            {
                return BadRequest(ModelState);
            }
            //objUser ya user sınıfından birşey ya da null olucak,belirlenen kurala uygun olan ilk veriyi döndericek
            //eğer böyle bir veri yoksa null dönücek,FirstOrDefault bu işe yarar.

            //aynı e mail adresten birden fazla kullanıcı kabul etmiycez, bunun için email kontrolü yapıyoruz.
            var objUser = dbContext.Users.FirstOrDefault(x => x.Email == userDTO.Email);
            if (objUser == null)
            {
                if (string.IsNullOrWhiteSpace(userDTO.FirstName)) //FirstName boş mu dolu mu kontrolü
                {
                    return BadRequest("İsim kısmı boş olamaz");
                }
                if (string.IsNullOrWhiteSpace(userDTO.LastName)) //LastName boş mu dolu mu kontrolü
                {
                    return BadRequest("Soyisim kısmı boş olamaz");
                }
                if (userDTO.Password.Length >=8) // şifre 8 harften küçük olmamalı
                {
                    //Şifrede en az bir tane büyük harf olmalı
                    if (System.Text.RegularExpressions.Regex.IsMatch(userDTO.Password,@"[A-Z]")) 
                    {
                        //IsValidEmail() benim oluşturduğum emailin doğru olup olmadığını kontrol eden fonksiyon.
                        if (!EmailControl(userDTO.Email))
                        {
                            return BadRequest("Lütfen geçerli bir e-mail giriniz");
                        }

                        //burda userDTO dan gelen bilgilerle yeni bir user oluşturuyoruz, userDTO değil,
                        //user olarak dbye kaydedicez , kullanıcıdan register kısmı için userDTO olarak alıcaz.
                        dbContext.Users.Add(new User
                        {
                            FirstName = userDTO.FirstName,
                            LastName = userDTO.LastName,
                            Email = userDTO.Email,
                            Password = userDTO.Password
                        });
                        dbContext.SaveChanges();
                        return Ok("User Registered Successfully");
                       
                    }
                    else
                    {
                        return BadRequest("Şifre en az bir büyük harf içermeli");
                    }
                   
                }
                else
                {
                    return BadRequest("Şifre 8 karakterden küçük olamaz!");
                }
                
            }
        
            else
            {
                return BadRequest("Girilen mail ile kayıtlı kullanıcı zaten mevcut");
            }
        }

        //LOGIN KISMI(GİRİŞ KISMI)
        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginDTO loginDTO)
        {
            //Girdiğimiz parola ve mail db'de eşleşirse geriye user döndür, eşleşmezse NoContent() döndür.

            //Ayrıca login kısmına Jwt token ekliyoruz.
            var user = dbContext.Users.FirstOrDefault(x => x.Email == loginDTO.Email && x.Password == loginDTO.Password);
            if(user != null)
            {
                var claims = new[]
                {
                   new Claim(JwtRegisteredClaimNames.Sub,configuration["Jwt:Subject"]), // Tokenin hangi kullanıcıya ait olduğunu belirtir
                   new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()), //Tokenin benzersiz id almasını sağlar
                   new Claim("UserId",user.UserId.ToString()) //Kullanıcının benzersiz kimliğini tokena ekler.
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));//Jwt tokenı imzalama ve doğrulama
                var signIn = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    configuration["Jwt:Issuer"],
                    configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(10),
                    signingCredentials: signIn
                    );
                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new {Token = tokenValue,User = user}); // Başarılı olursa da hem user'ı hem de token'ı dönder
               
            }
            else
            {
                return BadRequest("Email veya Şifre yanlış");
            }
            
        }
        //USERLARI GET ETMEK
        [Authorize]
        [HttpGet]
        [Route("GetUsers")]
        public IActionResult GetUsers()
        {
            return Ok(dbContext.Users.ToList());
        }
        //BELİRLİ ID YE GORE USER GET ETMEK
        [Authorize]
        [HttpGet]
        [Route("GetUser")]
        public IActionResult GetUser(int id)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.UserId == id);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return NoContent();
            }
        }
        //Delete işlemi
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = dbContext.Users.Find(id);
            if (dbContext.Users == null)
            {
                return BadRequest("Liste Boş");
            }
            if (user == null)
            {
                return BadRequest("Listede böyle bir kullanıcı yok");
            }
            dbContext.Users.Remove(user);
            dbContext.SaveChanges();
            return Ok();
        }
        //Şifre Güncellemesi maile göre
        [AllowAnonymous]
        [HttpPut]
        [Route("UpdatePassword")]
        public IActionResult UpdatePassword(UpdatePasswordDTO updatePasswordDTO)
        {
            var user = dbContext.Users.FirstOrDefault(x=>x.Email==updatePasswordDTO.Email && x.Password==updatePasswordDTO.CurrentPassword);
            if (user == null)
            {
                return BadRequest("Email veya Şifre Yanlış");
            }
            if(updatePasswordDTO.NewPassword.Length < 8 )
            {
                return BadRequest("Şifre 8 karakterden küçük olamaz");
            }
            if (string.IsNullOrWhiteSpace(updatePasswordDTO.NewPassword))
            {
                return BadRequest("Şifre boş olamaz");
            }
            if (!(System.Text.RegularExpressions.Regex.IsMatch(updatePasswordDTO.NewPassword, @"[A-Z]")))
            {
                return BadRequest("Şifre en az bir büyük harf içermeli");
            }

            user.Password = updatePasswordDTO.NewPassword;
            dbContext.SaveChanges();
            return Ok();
        }
        //girilen e mailin gerçek bir e mail olup olmadığını kontrol ettiğimiz fonksiyon
        bool EmailControl(string email)
        {
            try
            {
                var address = new MailAddress(email);
                return address.Address == email;

            }
            catch
            {
                return false;

            }
        }

        

    }
    
}

