<!-- SelecionarIngredientes.vue -->

<template>
  <!-- Seu template aqui -->
</template>

<script>
import { obterMissoes } from '@/http/index';
import CardMissao from './CardMissao.vue';
import BotaoPrincipal from './BotaoPrincipal.vue';

export default {
  name: 'SelecionarIngredientes',
  data() {
    return {
      missoes: []
    };
  },
  created() {
    obterMissoes().then(missoes => {
      this.missoes = missoes;
    });
  },
  components: { CardMissao, BotaoPrincipal },
  methods: {
    // Adicione os métodos que você estava emitindo se eles realizarem ações específicas
  }
};
</script>

<style scoped>
/* Aplica Montserrat a todos os elementos dentro de selecionar-ingredientes */
.selecionar-ingredientes {
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  letter-spacing: -0.1em; /* Kerning para h2 */
  font-weight: bold; /* Mantém negrito conforme solicitado */
}

/* Ajusta o kerning para todos os outros textos que não sejam h2 */
.selecionar-ingredientes *:not(h2) {
  letter-spacing: -0.02em;
}

/* Seus estilos existentes continuam aqui */
.titulo-ingredientes, .titulo-missoes, .paragrafo-lg, .paragrafo, .paragrafo-dica {
  /* Certifique-se de manter negrito onde necessário */
  font-weight: bold;
}

/* Outros estilos mantidos */

@media only screen and (max-width: 767px) {
  .dica {
    margin-bottom: 2.5rem;
  }
}

/* Estilos para os cards de missão */
.missoes {
  width: 100%; /* Faz com que a lista ocupe toda a largura disponível */
  list-style: none; /* Remove os marcadores padrão da lista */
  padding: 0; /* Remove o padding padrão da lista */
  margin: 0 auto; /* Centraliza a lista se necessário */
}

.missoes li {
  width: 100%; /* Faz com que cada item da lista ocupe a largura total disponível */
  margin-bottom: 1rem; /* Adiciona espaço entre os itens da lista */
}

/* Mantém os estilos originais do card de missão */
.missao {
  width: 100%; /* Faz com que o card de missão ocupe toda a largura disponível da sua linha */
  /* Mantém os outros estilos existentes */
}
</style>
