// Popula localStorage com clientes fixos do HTML caso esteja vazio
if (!localStorage.getItem('novosClientes') || JSON.parse(localStorage.getItem('novosClientes')).length === 0) {
  const clientesIniciais = [
    { nome: 'Maria Silva', quarto: '101', valorQuarto: 200, descricaoQuarto: 'Quarto Standard com vista para o jardim.', fotoQuarto: '', checkin: '2025-07-10', checkout: '2025-07-15', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'João Pereira', quarto: '202', valorQuarto: 250, descricaoQuarto: 'Quarto Luxo com banheira de hidromassagem.', fotoQuarto: '', checkin: '2025-07-12', checkout: '2025-07-14', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'Ana Costa', quarto: '303', valorQuarto: null, descricaoQuarto: '', fotoQuarto: '', checkin: '2025-07-08', checkout: '2025-07-11', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'Lucas Alves', quarto: '404', valorQuarto: null, descricaoQuarto: '', fotoQuarto: '', checkin: '2025-07-07', checkout: '2025-07-10', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' }
  ];
  localStorage.setItem('novosClientes', JSON.stringify(clientesIniciais));
}
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
    gastosExtras: [],
    formaPagamento: document.getElementById('formaPagamento').value
  };

  const clientesExistentes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  clientesExistentes.push(novoCliente);
  localStorage.setItem('novosClientes', JSON.stringify(clientesExistentes));

  window.location.href = "reservas.html";
});

// Função para exibir e editar forma de pagamento dos clientes já existentes
function exibirClientesComPagamento() {
  const clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  const tabela = document.getElementById('tabelaReservas');
  if (!tabela) return;
  const tbody = tabela.querySelector('tbody');
  tbody.innerHTML = '';
  // O número da reserva começa em 1001 e incrementa para cada cliente
  clientes.forEach((c, idx) => {
    const numeroReserva = 1001 + idx;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${numeroReserva}</td>
      <td>${c.nome}</td>
      <td>${c.quarto}</td>
      <td>${c.checkin}</td>
      <td>${c.checkout}</td>
      <td>${c.formaPagamento || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.alterarFormaPagamento = function(idx, valor) {
  const clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  if (clientes[idx]) {
    clientes[idx].formaPagamento = valor;
    // Se for cartão de crédito, perguntar parcelas
    if (valor === 'Cartão de Crédito') {
      let parcelas = prompt('Quantas parcelas? (1 a 12, sem juros)', clientes[idx].parcelas || '1');
      parcelas = Math.max(1, Math.min(12, parseInt(parcelas) || 1));
      clientes[idx].parcelas = parcelas;
    } else {
      delete clientes[idx].parcelas;
    }
    localStorage.setItem('novosClientes', JSON.stringify(clientes));
    exibirClientesComPagamento();
  }
};

window.mostrarQrCodePix = function(idx) {
  const clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  const c = clientes[idx];
  if (!c) return;
  // Geração simples de payload Pix (exemplo, personalize para produção)
  const chavePix = 'chavepix@exemplo.com';
  const valor = c.valorQuarto || 0;
  const nome = encodeURIComponent(c.nome);
  const payload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}520400005303986540${valor.toFixed(2).replace('.', '')}5802BR5913${nome}6009SAO PAULO62070503***6304`;
  // Usa API de QR Code pública
  const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(payload)}`;
  document.getElementById('qrcode-pix-' + idx).innerHTML = `<img src='${urlQr}' alt='QR Code Pix'/>`;
};
// Chama a função ao carregar a página de reservas
if (window.location.pathname.endsWith('reservas.html')) {
  window.addEventListener('DOMContentLoaded', exibirClientesComPagamento);
}

// Supondo que reserva.gastosExtras seja um array
let total = 0;
const lista = document.getElementById('listaGastosExtras');
if (lista && typeof reserva !== 'undefined' && reserva.gastosExtras && reserva.gastosExtras.length > 0) {
  lista.innerHTML = '';
  reserva.gastosExtras.forEach(gasto => {
    const item = document.createElement('li');
    item.textContent = `${gasto.descricao}: R$ ${gasto.valor.toFixed(2)}`;
    lista.appendChild(item);
    total += gasto.valor;
  });
  document.getElementById('totalGastosExtras').innerText = `R$ ${total.toFixed(2)}`;
}
