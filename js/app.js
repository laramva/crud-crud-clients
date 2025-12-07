import { ClienteService } from "./classes.js";
import { validarCliente, criarItemLista, contarClientes } from "./utils.js";

/* ===== CONFIGURAÇÃO DO CRUDCRUD ===== */
const API_BASE = "https://crudcrud.com/api/SEU_TOKEN/clients";

const service = new ClienteService(API_BASE);

/* ===== ELEMENTOS DO DOM ===== */
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const btnSalvar = document.getElementById("btnSalvar");
const listaClientes = document.getElementById("listaClientes");
const msgErro = document.getElementById("msgErro");

/* ===== FUNÇÕES ===== */

async function carregarClientes() {
    const clientes = await service.listar();

    listaClientes.innerHTML = "";

    clientes.map(cliente => {
        const item = criarItemLista(cliente, excluirCliente);
        listaClientes.appendChild(item);
    });

    console.log("Total de clientes:", contarClientes(clientes));
}

async function salvarCliente() {
    const nome = nomeInput.value;
    const email = emailInput.value;

    if (!validarCliente(nome, email)) {
        msgErro.textContent = "Preencha nome e e-mail corretamente.";
        return;
    }

    msgErro.textContent = "";

    await service.criar({ nome, email });

    nomeInput.value = "";
    emailInput.value = "";

    carregarClientes();
}

async function excluirCliente(id) {
    await service.excluir(id);
    carregarClientes();
}

/* ===== EVENTOS ===== */
btnSalvar.addEventListener("click", salvarCliente);

/* Carrega ao abrir a página */
carregarClientes();
