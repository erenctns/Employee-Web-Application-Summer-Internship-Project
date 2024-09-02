using Microsoft.EntityFrameworkCore;

namespace CRUDApi.Models
{
    public class EmployeeContext:DbContext // DbContext'den miras alma işlemi
    {
        public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employees { get; set; }
    }
}
