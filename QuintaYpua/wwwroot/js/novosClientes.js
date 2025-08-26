// Atualiza o faturamento incluindo gastos extras de cada cliente
function atualizarFaturamento() {
  const clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
  const tabela = document.getElementById('tabelaResumoFaturamento');
  if (!tabela) return;
  const tbody = tabela.querySelector('tbody');
  tbody.innerHTML = '';
  clientes.forEach(cliente => {
    // Valor do quarto
    if (cliente.valorQuarto) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>Cliente</td><td>${cliente.nome}</td><td>R$ ${Number(cliente.valorQuarto).toFixed(2)}</td>`;
      tbody.appendChild(tr);
    }
    // Gastos extras
    if (cliente.gastosExtras && cliente.gastosExtras.length > 0) {
      cliente.gastosExtras.forEach(gasto => {
        const total = (gasto.valor || 0) * (gasto.quantidade || 1);
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>Cliente</td><td>${cliente.nome}</td><td>R$ ${total.toFixed(2)}</td>`;
        tbody.appendChild(tr);
      });
    }
  });
}

// Chama atualizarFaturamento ao carregar a aba de faturamento
if (window.location.pathname.endsWith('reservas.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    const tabFaturamento = document.getElementById('tab-faturamento');
    if (tabFaturamento) {
      tabFaturamento.addEventListener('click', atualizarFaturamento);
    }
    // Atualiza ao carregar também
    atualizarFaturamento();
  });
}
// --- Seleção de Quarto ---
document.addEventListener('DOMContentLoaded', function() {
  const btnAbrirModalQuartos = document.getElementById('btnAbrirModalQuartos');
  if (btnAbrirModalQuartos) {
    btnAbrirModalQuartos.addEventListener('click', function() {
      // Lista de quartos disponíveis (pode ser dinâmica futuramente)

      const quartos = [
        { numero: "101", valor: 200, descricao: "Quarto Standard com vista para o jardim." },
        { numero: "102", valor: 210, descricao: "Quarto Standard com varanda privativa." },
        { numero: "201", valor: 230, descricao: "Quarto Luxo com cama king size." },
        { numero: "202", valor: 250, descricao: "Quarto Luxo com banheira de hidromassagem." },
        { numero: "301", valor: 180, descricao: "Quarto Econômico, ideal para casais." },
        { numero: "302", valor: 220, descricao: "Quarto Família com dois ambientes." }
      ];

      // Buscar quartos já reservados
      const clientes = JSON.parse(localStorage.getItem('novosClientes') || '[]');
      const quartosOcupados = clientes.map(c => c.quarto);

      let html = '<div class="row" id="listaQuartosTemp">';
      const fotos = {
        '101': 'img/quartos/quarto1.jpeg',
        '102': 'img/quartos/quarto2.jpeg',
        '201': 'img/quartos/quarto3.jpeg',
        '202': 'img/quartos/quarto4.jpeg',
        '301': 'img/quartos/quarto5.jpeg',
        '302': 'img/quartos/quarto6.jpeg'
      };
      quartos.forEach(q => {
        const foto = fotos[q.numero] || 'img/quartos/quarto1.jpeg';
        const ocupado = quartosOcupados.includes(q.numero);
        html += `
        <div class="col-md-4 mb-3">
          <div class="card h-100 shadow-sm quarto-card-select ${ocupado ? 'quarto-ocupado' : ''}" style="cursor:${ocupado ? 'not-allowed' : 'pointer'};opacity:${ocupado ? '0.6' : '1'};" data-numero="${q.numero}" data-valor="${q.valor}" data-descricao="${q.descricao}" data-foto="${foto}" ${ocupado ? 'data-ocupado="1"' : ''}>
            <img src="${foto}" class="card-img-top" alt="Foto Quarto ${q.numero}" style="height:140px;object-fit:cover;">
            <div class="card-body p-2">
              <h6 class="card-title mb-1">Quarto ${q.numero} <span class="badge bg-success">R$${q.valor}</span> ${ocupado ? '<span class="badge bg-danger ms-2">Ocupado</span>' : ''}</h6>
              <p class="card-text" style="font-size:0.95em;">${q.descricao}</p>
            </div>
          </div>
        </div>
        `;
      });
      html += '</div>';

      // Exibir em um modal simples (usando o próprio modalCadastro)
      const modalBody = document.querySelector('#modalCadastro .modal-body');
      // Remover lista antiga se houver
      const oldList = document.getElementById('listaQuartosTemp');
      if (oldList) oldList.remove();
      const infoDiv = document.createElement('div');
      infoDiv.innerHTML = html;
      infoDiv.id = 'listaQuartosTemp';
      infoDiv.style.zIndex = 9999;
      infoDiv.style.position = 'absolute';
      infoDiv.style.background = '#fff';
      infoDiv.style.width = '95%';
      infoDiv.style.left = '2.5%';
      infoDiv.style.top = '30px';
      infoDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.15)';
      infoDiv.style.borderRadius = '12px';
      infoDiv.style.padding = '12px';
      infoDiv.style.maxHeight = '350px';
      infoDiv.style.overflowY = 'auto';
      modalBody.appendChild(infoDiv);

      // Evento de seleção
      infoDiv.querySelectorAll('.quarto-card-select').forEach(card => {
        card.addEventListener('click', function() {
          if (this.getAttribute('data-ocupado') === '1') {
            alert('Este quarto já está reservado. Selecione outro.');
            return;
          }
          const numero = this.getAttribute('data-numero');
          const valor = this.getAttribute('data-valor');
          const descricao = this.getAttribute('data-descricao');
          const foto = this.getAttribute('data-foto');
          document.getElementById('quarto').value = numero;
          document.getElementById('quartoSelecionadoInfo').innerHTML = `<div class='d-flex align-items-center gap-2'><img src='${foto}' style='width:60px;height:40px;object-fit:cover;border-radius:6px;'><div><b>Quarto ${numero}</b> - R$${valor}<br><small>${descricao}</small></div></div>`;
          document.getElementById('btnRemoverQuarto').classList.remove('d-none');
          infoDiv.remove();
        });
      });
    });
  }

  // Remover seleção de quarto
  const btnRemoverQuarto = document.getElementById('btnRemoverQuarto');
  if (btnRemoverQuarto) {
    btnRemoverQuarto.addEventListener('click', function() {
      document.getElementById('quarto').value = '';
      document.getElementById('quartoSelecionadoInfo').innerHTML = '';
      btnRemoverQuarto.classList.add('d-none');
    });
  }
});
// URL base da API
const API_BASE = '/api';


// Remover clientes fixos do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  const clientes = JSON.parse(localStorage.getItem('novosClientes') || '[]');
  // Lista de nomes dos clientes fixos
  const nomesFixos = ['Maria Silva', 'João Pereira', 'Ana Costa', 'Lucas Alves'];
  const filtrados = clientes.filter(c => !nomesFixos.includes(c.nome));
  if (filtrados.length !== clientes.length) {
    localStorage.setItem('novosClientes', JSON.stringify(filtrados));
  }
});

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
  let aguardandoCartao = false;
  let dadosCartaoTemp = null;
  const btnSalvarCartao = document.getElementById('btnSalvarCartao');
  if (btnSalvarCartao) {
    btnSalvarCartao.onclick = async function() {
      if (!aguardandoCartao) return;
      // Pega dados do cartão
      const formaPagamento = dadosCartaoTemp.formaPagamento;
      const q = dadosCartaoTemp.q;
      const dadosCartao = {
        numero: document.getElementById('modalCartaoNumero').value,
        validade: document.getElementById('modalCartaoValidade').value,
        cvv: document.getElementById('modalCartaoCVV').value,
        nome: document.getElementById('modalCartaoNome').value,
        parcelas: (formaPagamento === 'Cartão de Crédito') ? document.getElementById('modalCartaoParcelas').value : null
      };
      aguardandoCartao = false;
      dadosCartaoTemp = null;
      var modalCartao = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCartao'));
      modalCartao.hide();
      await cadastrarClienteComCartao(q, formaPagamento, dadosCartao);
    };
  }

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

    // Detectar forma de pagamento selecionada
    let formaPagamento = "Dinheiro";
    if (document.getElementById('tab-pix').classList.contains('active')) {
      formaPagamento = "Pix";
    } else if (document.getElementById('tab-credito').classList.contains('active')) {
      formaPagamento = "Cartão de Crédito";
    } else if (document.getElementById('tab-debito').classList.contains('active')) {
      formaPagamento = "Cartão de Débito";
    }

    // Se for crédito ou débito, abrir modal de cartão e interromper o submit
    if (formaPagamento === 'Cartão de Crédito' || formaPagamento === 'Cartão de Débito') {
      // Exibe o campo de parcelas só para crédito
      document.getElementById('grupoParcelas').style.display = (formaPagamento === 'Cartão de Crédito') ? '' : 'none';
      document.getElementById('modalCartaoNumero').value = '';
      document.getElementById('modalCartaoValidade').value = '';
      document.getElementById('modalCartaoCVV').value = '';
      document.getElementById('modalCartaoNome').value = '';
      document.getElementById('modalCartaoParcelas').value = '1';
      aguardandoCartao = true;
      dadosCartaoTemp = { q, formaPagamento };
      var modalCartao = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCartao'));
      modalCartao.show();
      return;
    }

    // Se não for cartão, cadastrar normalmente
    await cadastrarClienteComCartao(q, formaPagamento, null);
  });

  // Função para cadastrar cliente com ou sem cartão
  async function cadastrarClienteComCartao(q, formaPagamento, dadosCartao) {
    const fotoBase64 = document.getElementById('previewFotoQuarto')?.src || "";
    const novoCliente = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      quarto: document.getElementById('quarto').value,
      valorQuarto: q ? q.valor : null,
      descricaoQuarto: q ? q.descricao : "",
      fotoQuarto: fotoBase64 && fotoBase64.startsWith('data:image') ? fotoBase64 : "",
      checkin: document.getElementById('checkin').value,
      checkout: document.getElementById('checkout').value,
      observacoes: document.getElementById('observacoes').value,
      status: "Pré-Reserva",
      gastosExtras: [],
      formaPagamento: formaPagamento,
      cartao: dadosCartao
    };

    // Salvar no localStorage
    const clientesExistentes = JSON.parse(localStorage.getItem('novosClientes')) || [];
    clientesExistentes.push(novoCliente);
    localStorage.setItem('novosClientes', JSON.stringify(clientesExistentes));
    // Sincronizar para a chave 'clientes' (usada na aba de status)
    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

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
          formaPagamento: novoCliente.formaPagamento || null,
          cartao: dadosCartao
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

    // Atualizar tabela sem recarregar a página
    if (typeof exibirClientesLocalStorage === 'function') {
      exibirClientesLocalStorage();
    }
    // Fechar modal de cadastro
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCadastro'));
    modal.hide();
    // Limpar formulário
    form.reset();
    document.getElementById('quartoSelecionadoInfo').innerHTML = '';
    document.getElementById('btnRemoverQuarto').classList.add('d-none');
    // Se for Pix, mostrar modal com QR Code usando o código do vídeo
    if (formaPagamento === 'Pix') {
      const payload = 'https://youtu.be/1k8craCGpgs?feature=shared';
      const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payload)}`;
      var area = document.getElementById('pixQrCodeArea');
      if (area) area.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div style="font-size:1.3rem;font-weight:600;color:#0d9488;margin-bottom:10px;">Pagamento via Pix</div>
          <img src='${urlQr}' alt='QR Code Pix' style="border-radius:16px;box-shadow:0 2px 16px #0d948855;width:280px;height:280px;background:#fff;"/>
          <div style="margin-top:14px;font-size:1.1rem;color:#333;">Aponte a câmera do seu banco para o QR Code</div>
        </div>
      `;
      var info = document.getElementById('pixQrCodeInfo');
      if (info) info.innerText = '';
      var modalPix = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPixQr'));
      modalPix.show();
    }
  }
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
  
  const precos = {
    '101': 200, '102': 210, '201': 230, '202': 250, '301': 180, '302': 220
  };
  clientes.forEach((c, idx) => {
    const numeroReserva = 1001 + idx;
    let valor = c.valorQuarto;
    if (!valor && precos[c.quarto]) valor = precos[c.quarto];
    let valorStr = valor ? `R$ ${Number(valor).toFixed(2)}` : '-';
    let pagamentoStr = c.formaPagamento ? ` (${c.formaPagamento})` : '';
    const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${numeroReserva}</td>
        <td class="d-flex align-items-center gap-2">
          <span>${c.nome}</span>
          <button class="btn btn-link p-0 m-0 text-secondary" title="Excluir cliente" onclick="removerClienteLocal(${idx})">
            <i class="bi bi-trash-fill" style="font-size:1.2rem;color:#6c757d;"></i>
          </button>
        </td>
        <td>${c.quarto}</td>
        <td>${c.checkin}</td>
        <td>${c.checkout}</td>
        <td>${valorStr}${pagamentoStr}</td>
      `;
    tbody.appendChild(tr);
  });

// Função global para remover cliente do localStorage
window.removerClienteLocal = function(idx) {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    let clientes = JSON.parse(localStorage.getItem('novosClientes')) || [];
    clientes.splice(idx, 1);
    localStorage.setItem('novosClientes', JSON.stringify(clientes));
    // Sincronizar para a chave 'clientes' (usada na aba de status)
    localStorage.setItem('clientes', JSON.stringify(clientes));
    // Atualizar Reservas
    if (typeof exibirClientesLocalStorage === 'function') {
      exibirClientesLocalStorage();
    }
    // Atualizar Faturamento
    if (typeof atualizarFaturamento === 'function') {
      atualizarFaturamento();
    }
    // Atualizar Calendário virtual
    if (typeof renderizarCalendarioCheckinCheckout === 'function') {
      renderizarCalendarioCheckinCheckout();
    }
  }
}
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
