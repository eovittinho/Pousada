using Microsoft.EntityFrameworkCore;
using QuintaYpua.Models;

namespace QuintaYpua.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<Reserva> Reservas { get; set; }
		public DbSet<GastoExtra> GastosExtras { get; set; }
	}
}
