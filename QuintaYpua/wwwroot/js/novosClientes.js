const form = document.getElementById('formCadastro');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const q = [
    { numero: "101", valor: 200, descricao: "Quarto Standard com vista para o jardim." },
    { numero: "102", valor: 210, descricao: "Quarto Standard com varanda privativa." },
    { numero: "201", valor: 230, descricao: "Quarto Luxo com cama king size." },
    { numero: "202", valor: 250, descricao: "Quarto Luxo com banheira de hidromassagem." },
    { numero: "301", valor: 180, descricao: "Quarto Econômico, ideal para casais." },
    { numero: "302", valor: 220, descricao: "Quarto Família com dois ambientes." }
  ].find(q => q.numero === document.getElementById('quarto').value);
  const fotoBase64 = document.getElementById('previewFotoQuarto')?.src || "";
  const novoCliente = {
    nome: document.getElementById('nome').value,
    quarto: document.getElementById('quarto').value,
    valorQuarto: q ? q.valor : null,
    descricaoQuarto: q ? q.descricao : "",
    fotoQuarto: fotoBase64 && fotoBase64.startsWith('data:image') ? fotoBase64 : "",
    checkin: document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
    status: "Pré-Reserva",
    gastosExtras: [] 
  };

  const clientesExistentes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  clientesExistentes.push(novoCliente);
  localStorage.setItem('novosClientes', JSON.stringify(clientesExistentes));

  window.location.href = "reservas.html";
});

// Supondo que reserva.gastosExtras seja um array
let total = 0;
const lista = document.getElementById('listaGastosExtras');
lista.innerHTML = '';
if (reserva.gastosExtras && reserva.gastosExtras.length > 0) {
    reserva.gastosExtras.forEach(gasto => {
        const item = document.createElement('li');
        item.textContent = `${gasto.descricao}: R$ ${gasto.valor.toFixed(2)}`;
        lista.appendChild(item);
        total += gasto.valor;
    });
}
document.getElementById('totalGastosExtras').innerText = `R$ ${total.toFixed(2)}`;
