const form = document.getElementById('formCadastro');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const novoCliente = {
    nome: document.getElementById('nome').value,
    quarto: document.getElementById('quarto').value,
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
