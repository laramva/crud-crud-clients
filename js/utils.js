/* Função pura — valida cliente */
export function validarCliente(nome, email) {
    return nome.trim() !== "" && email.trim() !== "";
}

/* Criar item no HTML */
export function criarItemLista(cliente, callbackExcluir) {
    const li = document.createElement("li");
    li.classList.add("item-cliente");

    li.innerHTML = `
        <div>
            <strong>${cliente.nome}</strong><br>
            <span>${cliente.email}</span>
        </div>

        <button class="btn-delete">Excluir</button>
    `;

    li.querySelector(".btn-delete").addEventListener("click", () => {
        callbackExcluir(cliente._id);
    });

    return li;
}

/* Contar total usando reduce */
export function contarClientes(lista) {
    return lista.reduce(total => total + 1, 0);
}
