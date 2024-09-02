using Microsoft.EntityFrameworkCore;

namespace CRUDApi.Models
{
    public class MyDbContext:DbContext //DbContext mirası
    {
        public MyDbContext(DbContextOptions<MyDbContext>options):base(options) 
        {

        }
        public DbSet<User> Users { get; set; }
        //public DbSet<Role> Roles { get; set; }
    }
}
