// Assume-se que "@/http/mockData" é um caminho válido que aponta para o arquivo JavaScript correto
const missoesMock = require("@/http/mockData").missoesMock;

function obterDadosURL(url) {
  return fetch(url)
    .then(resposta => resposta.json());
}

function obterMissoes() {
  return new Promise(resolve => {
    // Simula uma resposta de API com um pequeno atraso
    setTimeout(() => resolve(missoesMock), 100); // 100ms de atraso para simular chamada de rede
  });
}

module.exports = {
  obterMissoes
};
