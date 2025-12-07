/* Definições de classes relacionadas a clientes */

export class Client {
  constructor(id, name, email) {
    this.id = id;
    this.name = name.trim();
    this.email = email.trim();
  }
}
