<!-- SeuComponente.vue -->

<template>
  <article class="missao">
    <div class="missao__bazicash">{{ missao.bazicash }} Bazicash</div>
    <div class="missao__conteudo">
      <h2 class="missao__nome">{{ missao.nome }}</h2>
      <p class="missao__descricao">{{ missao.descricao }}</p>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    missao: { type: Object, required: true }
  }
};
</script>

<style scoped>

.missao {
  max-width: 60%;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--branco, #FFF);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.missao__bazicash {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.missao__nome, .missao__descricao {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
