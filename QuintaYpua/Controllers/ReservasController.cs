using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuintaYpua.Data;
using QuintaYpua.Models;

namespace QuintaYpua.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
        {
            return await _context.Reservas
                .Include(r => r.Cliente)
                .Include(r => r.Quarto)
                .Include(r => r.FormaPagamento)
                .Include(r => r.GastosExtras)
                .ToListAsync();
        }

        // GET: api/reservas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reserva>> GetReserva(int id)
        {
            var reserva = await _context.Reservas
                .Include(r => r.Cliente)
                .Include(r => r.Quarto)
                .Include(r => r.FormaPagamento)
                .Include(r => r.GastosExtras)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (reserva == null)
                return NotFound();
            return reserva;
        }

        // POST: api/reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> PostReserva(ReservaDto reservaDto)
        {
            // Verificar se o cliente já existe ou criar um novo
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Nome == reservaDto.NomeCliente);

            if (cliente == null)
            {
                cliente = new Cliente
                {
                    Nome = reservaDto.NomeCliente,
                    Email = reservaDto.EmailCliente,
                    Telefone = reservaDto.TelefoneCliente,
                    Documento = reservaDto.DocumentoCliente
                };
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();
            }

            // Buscar o quarto pelo número
            var quarto = await _context.Quartos
                .FirstOrDefaultAsync(q => q.Numero == reservaDto.NumeroQuarto);

            if (quarto == null)
            {
                return BadRequest("Quarto não encontrado");
            }

            // Buscar forma de pagamento se especificada
            FormaPagamento? formaPagamento = null;
            if (!string.IsNullOrEmpty(reservaDto.FormaPagamento))
            {
                formaPagamento = await _context.FormasPagamento
                    .FirstOrDefaultAsync(f => f.Nome == reservaDto.FormaPagamento);
            }

            var reserva = new Reserva
            {
                ClienteId = cliente.Id,
                QuartoId = quarto.Id,
                DataEntrada = reservaDto.DataEntrada,
                DataSaida = reservaDto.DataSaida,
                Status = reservaDto.Status ?? "Pré-Reserva",
                FormaPagamentoId = formaPagamento?.Id,
                Parcelas = reservaDto.Parcelas
            };

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReserva", new { id = reserva.Id }, reserva);
        }

        // PUT: api/reservas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReserva(int id, ReservaDto reservaDto)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null)
            {
                return NotFound();
            }

            // Atualizar forma de pagamento se especificada
            if (!string.IsNullOrEmpty(reservaDto.FormaPagamento))
            {
                var formaPagamento = await _context.FormasPagamento
                    .FirstOrDefaultAsync(f => f.Nome == reservaDto.FormaPagamento);
                reserva.FormaPagamentoId = formaPagamento?.Id;
                reserva.Parcelas = reservaDto.Parcelas;
            }

            reserva.Status = reservaDto.Status ?? reserva.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Reservas.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/reservas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null)
                return NotFound();

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/reservas/5/gastos
        [HttpPost("{reservaId}/gastos")]
        public async Task<ActionResult<GastoExtra>> AdicionarGastoExtra(int reservaId, GastoExtraDto gastoDto)
        {
            var reserva = await _context.Reservas.FindAsync(reservaId);
            if (reserva == null)
            {
                return NotFound();
            }

            var gasto = new GastoExtra
            {
                ReservaId = reservaId,
                Descricao = gastoDto.Descricao,
                Valor = gastoDto.Valor
            };

            _context.GastosExtras.Add(gasto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReserva), new { id = reservaId }, gasto);
        }
    }

    public class ReservaDto
    {
        public string NomeCliente { get; set; } = string.Empty;
        public string? EmailCliente { get; set; }
        public string? TelefoneCliente { get; set; }
        public string? DocumentoCliente { get; set; }
        public string NumeroQuarto { get; set; } = string.Empty;
        public DateTime DataEntrada { get; set; }
        public DateTime DataSaida { get; set; }
        public string? Status { get; set; }
        public string? FormaPagamento { get; set; }
        public int? Parcelas { get; set; }
    }

    public class GastoExtraDto
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
    }
}