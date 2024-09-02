namespace CRUDApi.Models
{
    public class Employee
    {
        
        public int ID { get; set; }
        public string? Name { get; set; } // null olmasına izin verdik

        public string? Age { get; set; } // null olmasına izin verdik

        public int IsActive { get; set; }

    }
}
