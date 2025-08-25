namespace QuintaYpua.Models
{
    public class FormaPagamento
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public ICollection<Reserva>? Reservas { get; set; }
    }
}

