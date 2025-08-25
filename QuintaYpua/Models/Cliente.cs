namespace QuintaYpua.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Documento { get; set; }
        public ICollection<Reserva>? Reservas { get; set; }
    }
}

