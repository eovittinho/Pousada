// URL base da API
const API_BASE = '/api';

// Popula localStorage com clientes fixos do HTML caso esteja vazio
if (!localStorage.getItem('novosClientes') || JSON.parse(localStorage.getItem('novosClientes')).length === 0) {
  const clientesIniciais = [
    { nome: 'Maria Silva', quarto: '101', valorQuarto: 200, descricaoQuarto: 'Quarto Standard com vista para o jardim.', fotoQuarto: '', checkin: '2025-07-10', checkout: '2025-07-15', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'João Pereira', quarto: '202', valorQuarto: 250, descricaoQuarto: 'Quarto Luxo com banheira de hidromassagem.', fotoQuarto: '', checkin: '2025-07-12', checkout: '2025-07-14', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'Ana Costa', quarto: '301', valorQuarto: 180, descricaoQuarto: 'Quarto Econômico, ideal para casais.', fotoQuarto: '', checkin: '2025-07-08', checkout: '2025-07-11', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' },
    { nome: 'Lucas Alves', quarto: '302', valorQuarto: 220, descricaoQuarto: 'Quarto Família com dois ambientes.', fotoQuarto: '', checkin: '2025-07-07', checkout: '2025-07-10', status: 'Pré-Reserva', gastosExtras: [], formaPagamento: '' }
  ];
  localStorage.setItem('novosClientes', JSON.stringify(clientesIniciais));
  
  // Sincronizar com o banco de dados
  sincronizarClientesIniciais(clientesIniciais);
}

// Função para sincronizar clientes iniciais com o banco
async function sincronizarClientesIniciais(clientes) {
  for (const cliente of clientes) {
    try {
      await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCliente: cliente.nome,
          numeroQuarto: cliente.quarto,
          dataEntrada: cliente.checkin,
          dataSaida: cliente.checkout,
          status: cliente.status,
          formaPagamento: cliente.formaPagamento || null
        })
      });
    } catch (error) {
      console.error('Erro ao sincronizar cliente:', error);
    }
  }
}

const form = document.getElementById('formCadastro');

if (form) {
  form.addEventListener('submit', async function (e) {
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

    // Salvar no localStorage
    const clientesExistentes = JSON.parse(localStorage.getItem('novosClientes')) || [];
    clientesExistentes.push(novoCliente);
    localStorage.setItem('novosClientes', JSON.stringify(clientesExistentes));

    // Salvar no banco de dados
    try {
      const response = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCliente: novoCliente.nome,
          numeroQuarto: novoCliente.quarto,
          dataEntrada: novoCliente.checkin,
          dataSaida: novoCliente.checkout,
          status: novoCliente.status,
          formaPagamento: novoCliente.formaPagamento || null
        })
      });

      if (response.ok) {
        console.log('Reserva salva no banco de dados com sucesso');
      } else {
        console.error('Erro ao salvar reserva no banco de dados');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }

    window.location.href = "reservas.html";
  });
}

// Função para exibir e editar forma de pagamento dos clientes já existentes
async function exibirClientesComPagamento() {
  const tabela = document.getElementById('tabelaReservas');
  if (!tabela) return;
  
  const tbody = tabela.querySelector('tbody');
  tbody.innerHTML = '';

  try {
    // Buscar reservas do banco de dados
    const response = await fetch(`${API_BASE}/reservas`);
    if (response.ok) {
      const reservas = await response.json();
      
      reservas.forEach((reserva, idx) => {
        const numeroReserva = 1001 + idx;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${numeroReserva}</td>
          <td>${reserva.cliente?.nome || 'N/A'}</td>
          <td>${reserva.quarto?.numero || 'N/A'}</td>
          <td>${new Date(reserva.dataEntrada).toLocaleDateString('pt-BR')}</td>
          <td>${new Date(reserva.dataSaida).toLocaleDateString('pt-BR')}</td>
          <td>
            <select onchange="alterarFormaPagamento(${reserva.id}, this.value)">
              <option value="">Selecione...</option>
              <option value="Dinheiro" ${reserva.formaPagamento?.nome === 'Dinheiro' ? 'selected' : ''}>Dinheiro</option>
              <option value="Cartão de Crédito" ${reserva.formaPagamento?.nome === 'Cartão de Crédito' ? 'selected' : ''}>Cartão de Crédito</option>
              <option value="Cartão de Débito" ${reserva.formaPagamento?.nome === 'Cartão de Débito' ? 'selected' : ''}>Cartão de Débito</option>
              <option value="PIX" ${reserva.formaPagamento?.nome === 'PIX' ? 'selected' : ''}>PIX</option>
              <option value="Transferência Bancária" ${reserva.formaPagamento?.nome === 'Transferência Bancária' ? 'selected' : ''}>Transferência Bancária</option>
            </select>
            ${reserva.formaPagamento?.nome === 'Cartão de Crédito' && reserva.parcelas ? `<br><small>Parcelas: ${reserva.parcelas}x</small>` : ''}
          </td>
          <td>
            <button onclick="adicionarGastoExtra(${reserva.id})">Adicionar Gasto</button>
            ${reserva.formaPagamento?.nome === 'PIX' ? `<br><div id="qrcode-pix-${reserva.id}"><button onclick="mostrarQrCodePix(${reserva.id})">Gerar QR Code PIX</button></div>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      console.error('Erro ao buscar reservas do banco de dados');
      // Fallback para localStorage
      exibirClientesLocalStorage();
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    // Fallback para localStorage
    exibirClientesLocalStorage();
  }
}

// Função fallback para exibir clientes do localStorage
function exibirClientesLocalStorage() {
  const clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  const tabela = document.getElementById('tabelaReservas');
  if (!tabela) return;
  const tbody = tabela.querySelector('tbody');
  tbody.innerHTML = '';
  
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
      <td>
        <button onclick="alterarFormaPagamentoLocal(${idx})">Alterar Pagamento</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.alterarFormaPagamento = async function(reservaId, valor) {
  try {
    let parcelas = null;
    if (valor === 'Cartão de Crédito') {
      parcelas = prompt('Quantas parcelas? (1 a 12, sem juros)', '1');
      parcelas = Math.max(1, Math.min(12, parseInt(parcelas) || 1));
    }

    const response = await fetch(`${API_BASE}/reservas/${reservaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formaPagamento: valor,
        parcelas: parcelas
      })
    });

    if (response.ok) {
      console.log('Forma de pagamento atualizada com sucesso');
      exibirClientesComPagamento(); // Recarregar a tabela
    } else {
      console.error('Erro ao atualizar forma de pagamento');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

window.adicionarGastoExtra = async function(reservaId) {
  const descricao = prompt('Descrição do gasto extra:');
  const valor = prompt('Valor do gasto extra:');
  
  if (descricao && valor) {
    try {
      const response = await fetch(`${API_BASE}/reservas/${reservaId}/gastos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: descricao,
          valor: parseFloat(valor)
        })
      });

      if (response.ok) {
        console.log('Gasto extra adicionado com sucesso');
        alert('Gasto extra adicionado com sucesso!');
      } else {
        console.error('Erro ao adicionar gasto extra');
        alert('Erro ao adicionar gasto extra');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro na requisição');
    }
  }
};

window.mostrarQrCodePix = function(reservaId) {
  // Geração simples de payload Pix (exemplo, personalize para produção)
  const chavePix = 'chavepix@exemplo.com';
  const valor = 200; // Valor fixo para exemplo
  const nome = encodeURIComponent('Pousada Quinta Ypua');
  const payload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}520400005303986540${valor.toFixed(2).replace('.', '')}5802BR5913${nome}6009SAO PAULO62070503***6304`;
  // Usa API de QR Code pública
  const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(payload)}`;
  document.getElementById('qrcode-pix-' + reservaId).innerHTML = `<img src='${urlQr}' alt='QR Code Pix'/>`;
};

// Chama a função ao carregar a página de reservas
if (window.location.pathname.endsWith('reservas.html')) {
  window.addEventListener('DOMContentLoaded', exibirClientesComPagamento);
}
