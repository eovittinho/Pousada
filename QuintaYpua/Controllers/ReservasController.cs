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
                .Include(r => r.GastosExtras)
                .ToListAsync();
        }

        // GET: api/reservas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reserva>> GetReserva(int id)
        {
            var reserva = await _context.Reservas
                .Include(r => r.GastosExtras)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (reserva == null)
                return NotFound();
            return reserva;
        }

        // POST: api/reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> PostReserva(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
        }

        // PUT: api/reservas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReserva(int id, Reserva reserva)
        {
            if (id != reserva.Id)
                return BadRequest();

            _context.Entry(reserva).State = EntityState.Modified;
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
        public async Task<ActionResult<GastoExtra>> AdicionarGastoExtra(int reservaId, GastoExtra gasto)
        {
            gasto.ReservaId = reservaId;
            _context.GastosExtras.Add(gasto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReserva), new { id = reservaId }, gasto);
        }
    }
}