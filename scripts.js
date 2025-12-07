/* URL base da API do CRUDCrud */
const API_BASE = "https://crudcrud.com/api/22b6d7e9674c47d982c270eecd812709/clientes";

/* Elementos da interface */
const form = document.getElementById("cliente-form");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputObs = document.getElementById("observacoes");
const listaClientes = document.getElementById("clientes-lista");
const listaStatus = document.getElementById("lista-status");
const formFeedback = document.getElementById("form-feedback");

/* Estado simples em memória */
let clientes = [];

/* Carrega clientes ao iniciar a página */
document.addEventListener("DOMContentLoaded", () => {
    carregarClientes();
});

/* Evento de envio do formulário */
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparFeedback();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const observacoes = inputObs.value.trim();

    if (!nome || !email) {
        mostrarFeedback("Preencha pelo menos nome e e-mail para continuar.", "erro");
        return;
    }

    const novoCliente = { nome, email, observacoes };

    try {
        desabilitarFormulario(true);
        mostrarFeedback("Salvando cliente...", "neutro");

        const resposta = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoCliente)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar cliente.");
        }

        inputNome.value = "";
        inputEmail.value = "";
        inputObs.value = "";

        mostrarFeedback("Cliente cadastrado com sucesso.", "ok");
        carregarClientes();
    } catch (erro) {
        console.error(erro);
        mostrarFeedback("Não foi possível salvar o cliente. Verifique o endpoint do CRUDCrud.", "erro");
    } finally {
        desabilitarFormulario(false);
    }
});

/* Função para buscar todos os clientes */
async function carregarClientes() {
    listaStatus.textContent = "Carregando clientes...";
    listaClientes.innerHTML = "";

    try {
        const resposta = await fetch(API_BASE);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        clientes = await resposta.json();
        renderizarLista();
    } catch (erro) {
        console.error(erro);
        listaStatus.textContent =
            "Não foi possível carregar os clientes. Confira se o endpoint do CRUDCrud ainda é válido.";
    }
}

/* Renderiza a lista no DOM */
function renderizarLista() {
    listaClientes.innerHTML = "";

    if (!clientes.length) {
        listaStatus.textContent = "Nenhum cliente cadastrado até o momento.";
        return;
    }

    listaStatus.textContent = "";

    clientes.forEach((cliente) => {
        const li = document.createElement("li");
        li.className = "cliente-item";

        const avatar = document.createElement("div");
        avatar.className = "cliente-avatar";
        li.appendChild(avatar);

        const corpo = document.createElement("div");
        corpo.className = "cliente-body";

        const nomeEl = document.createElement("p");
        nomeEl.className = "cliente-nome";
        nomeEl.textContent = cliente.nome;
        corpo.appendChild(nomeEl);

        const emailEl = document.createElement("p");
        emailEl.className = "cliente-email";
        emailEl.textContent = cliente.email;
        corpo.appendChild(emailEl);

        if (cliente.observacoes) {
            const obsEl = document.createElement("p");
            obsEl.className = "cliente-notas";
            obsEl.textContent = cliente.observacoes;
            corpo.appendChild(obsEl);
        }

        li.appendChild(corpo);

        const acoes = document.createElement("div");
        acoes.className = "cliente-acoes";

        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.className = "btn-remover";
        btnRemover.textContent = "Remover";
        btnRemover.addEventListener("click", () => removerCliente(cliente._id));

        acoes.appendChild(btnRemover);

        const badgeId = document.createElement("span");
        badgeId.className = "badge-id";
        badgeId.textContent = `ID: ${cliente._id}`;
        acoes.appendChild(badgeId);

        li.appendChild(acoes);

        listaClientes.appendChild(li);
    });
}

/* Remove um cliente pelo id */
async function removerCliente(id) {
    const confirmar = window.confirm("Deseja realmente excluir este cliente?");
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir cliente.");
        }

        clientes = clientes.filter((c) => c._id !== id);
        renderizarLista();
    } catch (erro) {
        console.error(erro);
        mostrarFeedback("Não foi possível excluir o cliente. Tente novamente.", "erro");
    }
}

/* Utilitários de UI */
function mostrarFeedback(mensagem, tipo) {
    formFeedback.textContent = mensagem;
    formFeedback.classList.remove("ok", "erro");

    if (tipo === "ok") {
        formFeedback.classList.add("ok");
    } else if (tipo === "erro") {
        formFeedback.classList.add("erro");
    }
}

function limparFeedback() {
    formFeedback.textContent = "";
    formFeedback.classList.remove("ok", "erro");
}

function desabilitarFormulario(desabilitar) {
    Array.from(form.elements).forEach((el) => {
        el.disabled = desabilitar;
    });
}
