/* Funções auxiliares e configuração da API */


export const API_BASE_URL =
  "https://crudcrud.com/api/22b6d7e9674c47d982c270eecd812709/clientes";

export function validateClientData(name, email) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName || !trimmedEmail) {
    return {
      valid: false,
      message: "Preencha nome e e-mail para continuar."
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      valid: false,
      message: "Digite um e-mail válido."
    };
  }

  return { valid: true, message: "" };
}

/* Função pura que conta domínios usando reduce */
export function countEmailDomains(clients) {
  const domainCount = clients
    .map((client) => client.email.split("@")[1]?.toLowerCase() || "")
    .filter((domain) => domain)
    .reduce((acc, domain) => {
      const current = acc[domain] || 0;
      return { ...acc, [domain]: current + 1 };
    }, {});

  return Object.entries(domainCount).map(([domain, count]) => ({
    domain,
    count
  }));
}
