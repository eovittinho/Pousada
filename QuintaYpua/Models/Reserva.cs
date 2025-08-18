using System;

namespace QuintaYpua.Models
{
    public class Reserva
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public int QuartoId { get; set; }
        public DateTime DataEntrada { get; set; }
        public DateTime DataSaida { get; set; }
    public string? Status { get; set; }
    public ICollection<GastoExtra>? GastosExtras { get; set; }
    }
}
