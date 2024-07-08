const chave_transcoes_ls = "transacoes";

const form = document.getElementById("form");
const descInput = document.getElementById("descricao");
const valorInput = document.querySelector("#montante");
const balancoH1 = document.getElementById("balanco");
const receitaP = document.querySelector("#din-positivo");
const despesaP = document.querySelector("#din-negativo");
const transacoesUL = document.getElementById("transacoes");
const tipoSelect = document.getElementById("tipo");

let transacoesSalvas;

try {
  transacoesSalvas = JSON.parse(localStorage.getItem(chave_transcoes_ls)) || [];
} catch (erro) {
  transacoesSalvas = [];
}

if (!transacoesSalvas) {
  transacoesSalvas = [];
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const descTransacao = descInput.value.trim();
  const valorTransacao = parseFloat(valorInput.value.trim());
  const tipoTransacao = tipoSelect.value;

  if (descTransacao === "") {
    alert("Informe a descrição da transação!");
    descInput.focus();
    return;
  }
  if (isNaN(valorTransacao) || valorTransacao === 0) {
    alert("Informe um valor válido para a transação!");
    valorInput.focus();
    return;
  }

  const transacao = {
    id: transacoesSalvas.length,
    desc: descTransacao,
    valor: tipoTransacao === "saida" ? -Math.abs(valorTransacao) : Math.abs(valorTransacao),
  };

  somaAoSaldo(transacao);
  somaRecitaDespesa(transacao);
  addTransacaoAoDOM(transacao);

  transacoesSalvas.push(transacao);
  localStorage.setItem(chave_transcoes_ls, JSON.stringify(transacoesSalvas));

  descInput.value = "";
  valorInput.value = "";
});

function somaAoSaldo(transacao) {
  let valorBalanco = parseFloat(balancoH1.innerHTML.replace("R$", ""));
  valorBalanco += transacao.valor;
  balancoH1.innerHTML = `R$${valorBalanco.toFixed(2)}`;
}

function somaRecitaDespesa(transacao) {
  if (transacao.valor > 0) {
    let valor = parseFloat(receitaP.innerHTML.replace("+ R$", ""));
    valor += Math.abs(transacao.valor);
    receitaP.innerHTML = `+ R$${valor.toFixed(2)}`;
  } else {
    let valor = parseFloat(despesaP.innerHTML.replace("- R$", ""));
    valor += Math.abs(transacao.valor);
    despesaP.innerHTML = `- R$${valor.toFixed(2)}`;
  }
}

function addTransacaoAoDOM(transacao) {
  const cssClass = transacao.valor >= 0 ? "positivo" : "negativo";
  const currency = transacao.valor >= 0 ? "R$" : "R$-";

  const liElementStr = `${transacao.desc} <span>${currency}${Math.abs(transacao.valor).toFixed(2)}</span><button class="delete-btn" onclick="deletaTransacao(${transacao.id})">X</button>`;

  const liElement = document.createElement("li");
  liElement.classList.add(cssClass);
  liElement.innerHTML = liElementStr;
  transacoesUL.append(liElement);
}

function carregarDados() {
  transacoesUL.innerHTML = "";
  balancoH1.innerHTML = "R$0.00";
  receitaP.innerHTML = "+ R$0.00";
  despesaP.innerHTML = "- R$0.00";

  for (let i = 0; i < transacoesSalvas.length; i++) {
    let transacao = transacoesSalvas[i];
    somaAoSaldo(transacao);
    somaRecitaDespesa(transacao);
    addTransacaoAoDOM(transacao);
  }
}

function deletaTransacao(id) {
  const transacaoIndex = transacoesSalvas.findIndex((transacao) => transacao.id === id);

  if (transacaoIndex !== -1) {
    transacoesSalvas.splice(transacaoIndex, 1);
    localStorage.setItem(chave_transcoes_ls, JSON.stringify(transacoesSalvas));

    const liElementToDelete = transacoesUL.querySelector(`li:nth-child(${transacaoIndex + 1})`);
    if (liElementToDelete) {
      transacoesUL.removeChild(liElementToDelete);
    }

    carregarDados();
  }
}

carregarDados();
