/* Código principal: DOM, Fetch e regras de negócio */

import { Client } from "./classes.js";
import { API_BASE_URL, validateClientData, countEmailDomains } from "./utils.js";

/* Estado da aplicação */
const state = {
  clients: []
};

/* Referências ao DOM */
const form = document.getElementById("client-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const feedback = document.getElementById("feedback");
const clientsList = document.getElementById("clients-list");
const emptyState = document.getElementById("list-empty");
const statsTotal = document.getElementById("stats-total");
const statsDomains = document.getElementById("stats-domains");

/* Inicialização */
document.addEventListener("DOMContentLoaded", () => {
  loadClients();
});

/* Eventos */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleCreateClient();
});

clientsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='delete']");
  if (!button) return;

  const id = button.dataset.id;
  handleDeleteClient(id);
});

/* Requisições à API */

async function loadClients() {
  try {
    setFeedback("Carregando clientes...", "info");
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar clientes na API.");
    }

    const data = await response.json();

    state.clients = data.map(
      (payload) => new Client(payload._id, payload.name, payload.email)
    );

    renderClients();
    setFeedback("", "none");
  } catch (error) {
    console.error(error);
    setFeedback("Não foi possível carregar os clientes.", "error");
  }
}

async function handleCreateClient() {
  const name = nameInput.value;
  const email = emailInput.value;

  const validation = validateClientData(name, email);
  if (!validation.valid) {
    setFeedback(validation.message, "error");
    return;
  }

  try {
    setFeedback("Enviando dados para a API...", "info");

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar cliente na API.");
    }

    const payload = await response.json();
    const created = new Client(payload._id, payload.name, payload.email);

    state.clients = [...state.clients, created];
    renderClients();

    form.reset();
    nameInput.focus();
    setFeedback("Cliente salvo com sucesso.", "success");
  } catch (error) {
    console.error(error);
    setFeedback("Não foi possível salvar o cliente.", "error");
  }
}

async function handleDeleteClient(id) {
  const client = state.clients.find((c) => c.id === id);
  if (!client) return;

  if (!confirm(`Remover o cliente "${client.name}"?`)) {
    return;
  }

  try {
    setFeedback("Removendo cliente...", "info");

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Erro ao remover cliente na API.");
    }

    state.clients = state.clients.filter((c) => c.id !== id);
    renderClients();
    setFeedback("Cliente removido com sucesso.", "success");
  } catch (error) {
    console.error(error);
    setFeedback("Não foi possível remover o cliente.", "error");
  }
}

/* Renderização */

function renderClients() {
  clientsList.innerHTML = "";

  if (!state.clients.length) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";

    state.clients.forEach((client) => {
      const item = document.createElement("li");
      item.className = "client-item";
      item.innerHTML = `
        <div class="client-main">
          <p class="client-name">${client.name}</p>
          <p class="client-email">${client.email}</p>
        </div>
        <button
          class="btn-delete"
          data-action="delete"
          data-id="${client.id}"
          type="button"
        >
          Excluir
        </button>
      `;
      clientsList.appendChild(item);
    });
  }

  renderSummary();
}

function renderSummary() {
  const total = state.clients.length;
  statsTotal.textContent = total.toString();

  statsDomains.innerHTML = "";

  if (!total) {
    const li = document.createElement("li");
    li.className = "domain-item";
    li.textContent = "Nenhum domínio registrado.";
    statsDomains.appendChild(li);
    return;
  }

  const domainData = countEmailDomains(state.clients);

  domainData.forEach((item) => {
    const li = document.createElement("li");
    li.className = "domain-item";
    li.innerHTML = `
      <span>${item.domain}</span>
      <span class="domain-count">${item.count}</span>
    `;
    statsDomains.appendChild(li);
  });
}

/* Feedback visual */

function setFeedback(message, type) {
  feedback.textContent = message;

  feedback.classList.remove("feedback-error", "feedback-success", "feedback-info");

  if (type === "error") {
    feedback.classList.add("feedback-error");
  } else if (type === "success") {
    feedback.classList.add("feedback-success");
  } else if (type === "info") {
    feedback.classList.add("feedback-info");
  }
}
