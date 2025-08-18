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