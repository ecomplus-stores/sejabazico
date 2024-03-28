<template>
  <main class="account-asd">
    <SuaLista :ingredientes="ingredientes" />

    <component :is="conteudoComponente"
               v-bind="conteudoProps"
               v-on="conteudoEventos"
               v-if="conteudo === 'SelecionarIngredientes' || conteudo === 'MostrarReceitas'"
               v-show="conteudoVisivel">
    </component>
  </main>
</template>

<script>
import SuaLista from './SuaLista.vue';
import SelecionarIngredientes from './SelecionarIngredientes.vue';
import MostrarReceitas from './MostrarReceitas.vue';

export default {
  data() {
    return {
      ingredientes: [],
      conteudo: 'SelecionarIngredientes',
      conteudoComponente: SelecionarIngredientes,
      conteudoProps: {
        ingredientes: this.ingredientes
      },
      conteudoEventos: {
        'adicionar-ingrediente': this.adicionarIngrediente,
        'remover-ingrediente': this.removerIngrediente,
        'buscar-receitas': this.navegar,
        'editar-receitas': this.navegar
      },
      conteudoVisivel: true
    };
  },
  components: { SuaLista, SelecionarIngredientes, MostrarReceitas },
  methods: {
    adicionarIngrediente(ingrediente) {
      this.ingredientes.push(ingrediente);
    },
    removerIngrediente(ingrediente) {
      this.ingredientes = this.ingredientes.filter(iLista => ingrediente !== iLista);
    },
    navegar(pagina) {
      this.conteudoVisivel = false;
      setTimeout(() => {
        this.conteudo = pagina;
        this.conteudoVisivel = true;
      }, 0);
    }
  }
};
</script>

<style scoped>
.conteudo-principal {
  padding: 6.5rem 7.5rem;
  border-radius: 3.75rem 3.75rem 0rem 0rem;
  background: var(--creme, #FFFAF3);
  color: var(--cinza, #444);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
}

.sua-lista-texto {
  color: var(--coral, #F0633C);
  display: block;
  text-align: center;
  margin-bottom: 1.5rem;
}

.ingredientes-sua-lista {
  display: flex;
  justify-content: center;
  gap: 1rem 1.5rem;
  flex-wrap: wrap;
}

.lista-vazia {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;

  color: var(--coral, #F0633C);
  text-align: center;
}

@media only screen and (max-width: 1300px) {
  .conteudo-principal {
    padding: 5rem 3.75rem;
    gap: 3.5rem;
  }
}

@media only screen and (max-width: 767px) {
  .conteudo-principal {
    padding: 4rem 1.5rem;
    gap: 4rem;
  }
}
</style>
