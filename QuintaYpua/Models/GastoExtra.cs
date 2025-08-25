namespace QuintaYpua.Models
{
    public class GastoExtra
    {
        public int Id { get; set; }
        public int ReservaId { get; set; }
        public Reserva? Reserva { get; set; }
        public string? Descricao { get; set; }
        public decimal Valor { get; set; }
    }
}
