let carrinho = {};
let descontoAtivo = 0; // Nova variável para o cupom

function addProduto(nome, preco, imagem) {
  if (carrinho[nome]) {
    carrinho[nome].quantidade++;
  } else {
    carrinho[nome] = { preco, quantidade: 1, imagem };
  }
  atualizarCarrinho();
}

function removerProduto(nome) {
  if (carrinho[nome].quantidade > 1) {
    carrinho[nome].quantidade--;
  } else {
    delete carrinho[nome];
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoDiv = document.getElementById("carrinho");
  carrinhoDiv.innerHTML = "";
  let total = 0;

  for (let nome in carrinho) {
    const item = carrinho[nome];
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    carrinhoDiv.innerHTML += `
      <div class="item-carrinho">
        <div class="item-info">
          <img src="${item.imagem}">
          <span>${nome} <strong>${item.quantidade}x</strong></span>
        </div>
        <span class="item-preco">R$ ${subtotal.toFixed(2)}</span>
        <button onclick="removerProduto('${nome}')">✖</button>
      </div>
    `;
  }

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("nav-total").innerText = total.toFixed(2);
}

// Funções de Cupom
function aplicarCupom() {
  const input = document.getElementById("cupom-input");
  const msg = document.getElementById("mensagem-cupom");
  
  if (input.value.trim() === "LUANA10") {
    descontoAtivo = 0.10;
    msg.innerText = "Cupom LUANA10 aplicado! (-10%)";
    msg.style.color = "#28a745";
    msg.style.display = "block";
    input.disabled = true;
    document.getElementById("btn-cupom").disabled = true;
  } else {
    descontoAtivo = 0;
    msg.innerText = "Cupom inválido.";
    msg.style.color = "#ff4d4d";
    msg.style.display = "block";
  }
}

function finalizarPedido() {
  if (Object.keys(carrinho).length === 0) {
    alert("Adicione pelo menos um produto.");
    return;
  }
  document.getElementById("app").style.display = "none";
  document.getElementById("tela-checkout").style.display = "flex";
}

function validarForm() {
  const nome = document.getElementById("nome").value;
  const tel = document.getElementById("telefone").value;
  const end = document.getElementById("endereco").value;
  const pag = document.getElementById("pagamento").value;
  const btn = document.getElementById("btn-confirmar-final");

  btn.disabled = !(nome && tel && end && pag);
}

function gerarResumo() {
  const nome = document.getElementById("nome").value;
  const end = document.getElementById("endereco").value;
  const pag = document.getElementById("pagamento").value;
  const resumoDiv = document.getElementById("resumo-pedido-final");
  
  let itensHtml = "";
  let totalOriginal = 0;

  for (let nomeItem in carrinho) {
    const item = carrinho[nomeItem];
    itensHtml += `<div>${item.quantidade}x ${nomeItem} - R$ ${(item.preco * item.quantidade).toFixed(2)}</div>`;
    totalOriginal += item.preco * item.quantidade;
  }

  const valorDesconto = totalOriginal * descontoAtivo;
  const totalFinal = totalOriginal - valorDesconto;

  resumoDiv.innerHTML = `
    <strong>Cliente:</strong> ${nome} <br>
    <strong>Endereço:</strong> ${end} <br>
    <strong>Pagamento:</strong> ${pag}
    <hr>
    <strong>Itens do Pedido:</strong>
    ${itensHtml}
    <hr>
    Subtotal: R$ ${totalOriginal.toFixed(2)} <br>
    ${descontoAtivo > 0 ? `<span style="color: #28a745;">Desconto (10%): - R$ ${valorDesconto.toFixed(2)}</span><br>` : ''}
    <strong>Total Final: R$ ${totalFinal.toFixed(2)}</strong>
  `;

  document.getElementById("tela-checkout").style.display = "none";
  document.getElementById("sucesso").style.display = "flex";
}

function voltarParaCarrinho() {
  document.getElementById("tela-checkout").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function voltarInicio() {
  // Reseta tudo, inclusive o cupom, para o estado inicial
  carrinho = {};
  descontoAtivo = 0;
  atualizarCarrinho();
  
  // Limpa os campos do formulário
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("pagamento").value = "";
  document.getElementById("cupom-input").value = "";
  document.getElementById("cupom-input").disabled = false;
  document.getElementById("btn-cupom").disabled = false;
  document.getElementById("mensagem-cupom").style.display = "none";
  document.getElementById("btn-confirmar-final").disabled = true;
  
  document.getElementById("sucesso").style.display = "none";
  document.getElementById("app").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}