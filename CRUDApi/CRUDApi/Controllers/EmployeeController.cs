using CRUDApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//Tüm CRUD işlemleri burada yapılacak
namespace CRUDApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase

    {   //DI(Dependecy Injection) kısmı
        private readonly EmployeeContext _employeeContext;
        public EmployeeController(EmployeeContext employeeContext)
        {
            _employeeContext = employeeContext; // artık her yerde kullanabilirim.
        }
        //CRUD İŞLEMLERİNE BAŞLIYORUZ

        //Tüm elemanlar için GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            return await _employeeContext.Employees.ToListAsync();
            //ActionResult<IEnumerable<Employee>>> kullanarak geri dönen türün tipini belli ettik ve ok() dememize
            //gerek kalmadı, başarılı olursa otomatik olarak ok döndürecektir,Iactionresulttan farkı bu.
        }
        //Belirli bir id için GET

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)//UI dan alacağı id parametresi
            //Ienumarable' ı kaldırdık çünkü bura her zaman tek veri dönecek, iterasyonlu bir adım yok o yüzden kaldırdık.
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();  
            }
            var employee = await _employeeContext.Employees.FindAsync(id);
            if(employee == null)
            {
                return NotFound();
            }
            return employee;

        }
        //Post işlemi
        [HttpPost]
        
        public async Task<ActionResult<Employee>>PostEmployee(Employee employee)// buradaki employee'yi biz UI'dan göndericez
        {
            //İsimsoyisim ve yaş kısımlarını boş bıraktırmamak için kontrol yaptırdım.
            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("İsim Soyisim Kısmı Boş Olamaz");
            }
            if (string.IsNullOrWhiteSpace(employee.Age))
            {
                return BadRequest("Yaş Kısmı Boş Olamaz");
            }
            _employeeContext.Employees.Add(employee);
            await _employeeContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.ID }, employee);
            //employee null kontrol ekle*********************************************
        }
        //ön taraftan verileri girilmiş halde employee aldık onu direkt databaseye yükledik sonra o employee'ye yeni id vererek ön yüzde
        //geri dönderdik.

        //Güncelleme için PUT, bu kısımda request atarken id kısmına, üzerinde değişiklik yaptığın employee'nin idsini vermen lazım.
        //Yoksa hata döner.
        [HttpPut("{id}")]
        public async Task<ActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.ID)
            {
                return BadRequest();
            }
            _employeeContext.Entry(employee).State = EntityState.Modified;
            //employeeContext.Entry() employee nesnesini DbContext'e bağlar , Modified olayı da bu nesnenin veritabanındaki mevcut kaydının
            //güncellenmesi gerektiğini belirtir ve veritabanına yansıtılmasını sağlar.
            try
            {
                await _employeeContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new InvalidOperationException($"Bu id de hata varrrr!!!!! {id}" );
            }
            return Ok();
        }
        //Delete işlemi
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            if(_employeeContext.Employees == null)
            {
                return NotFound();
            }
            var employee = await _employeeContext.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            _employeeContext.Employees.Remove(employee);
            await _employeeContext.SaveChangesAsync();
            return Ok();
        }
        //SEARCH İÇİN TAM ANLAŞILMADI.
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Employee>>> SearchEmployees([FromQuery] string? name)
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }

            var query = _employeeContext.Employees.AsQueryable();

            // Name filtresi
            if (!string.IsNullOrEmpty(name))
            {
               query = query.Where(e => e.Name != null && e.Name.Contains(name));
            }
            var employees = await query.ToListAsync();

            return employees;
        }

    }
}
