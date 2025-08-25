using Microsoft.EntityFrameworkCore;
using QuintaYpua.Models;

namespace QuintaYpua.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<Cliente> Clientes { get; set; }
		public DbSet<Quarto> Quartos { get; set; }
		public DbSet<Reserva> Reservas { get; set; }
		public DbSet<GastoExtra> GastosExtras { get; set; }
		public DbSet<FormaPagamento> FormasPagamento { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// Configuração de relacionamentos
			modelBuilder.Entity<Reserva>()
				.HasOne(r => r.Cliente)
				.WithMany(c => c.Reservas)
				.HasForeignKey(r => r.ClienteId);

			modelBuilder.Entity<Reserva>()
				.HasOne(r => r.Quarto)
				.WithMany(q => q.Reservas)
				.HasForeignKey(r => r.QuartoId);

			modelBuilder.Entity<Reserva>()
				.HasOne(r => r.FormaPagamento)
				.WithMany(f => f.Reservas)
				.HasForeignKey(r => r.FormaPagamentoId);

			modelBuilder.Entity<GastoExtra>()
				.HasOne(g => g.Reserva)
				.WithMany(r => r.GastosExtras)
				.HasForeignKey(g => g.ReservaId);

			// Configuração de precisão decimal
			modelBuilder.Entity<Quarto>()
				.Property(q => q.Valor)
				.HasPrecision(10, 2);

			modelBuilder.Entity<GastoExtra>()
				.Property(g => g.Valor)
				.HasPrecision(10, 2);

			base.OnModelCreating(modelBuilder);
		}
	}
}
