namespace VnuRehab.Models
{
    public enum Role { Doctor, Patient }
    public class User
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.Patient;
        public string DoctorId { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }
}
