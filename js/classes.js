/* Classe responsável por lidar com a API e o CRUD */

export class ClienteService {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    /* Buscar todos os clientes */
    async listar() {
        const resposta = await fetch(this.apiBaseUrl);
        return resposta.json();
    }

    /* Criar um novo cliente */
    async criar(cliente) {
        const resposta = await fetch(this.apiBaseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
        return resposta.json();
    }

    /* Excluir cliente */
    async excluir(id) {
        await fetch(`${this.apiBaseUrl}/${id}`, { method: "DELETE" });
    }
}
