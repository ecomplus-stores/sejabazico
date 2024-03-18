<script>

import {
  i19addToCart,
  i19close,
  i19next,
  i19previous,
  i19quantity,
  i19selectVariationMsg,
  i19item,
  i19minQuantity,
  i19maxQuantity
} from '@ecomplus/i18n'

import {
  i18n,
  name as getName,
  img as getImg
} from '@ecomplus/utils'

import APicture from '@ecomplus/storefront-components/src/APicture.vue'
import ALink from '@ecomplus/storefront-components/src/ALink.vue'
import AAlert from '@ecomplus/storefront-components/src/AAlert.vue'

export default {
  name: 'AccountGamification',

  components: {
    ALink,
    AAlert,
    APicture,
  },

  props: {
  },

  data () {
    return {
      glide: null,
      activeIndex: 0,
      alertVariant: 'warning',
      missions: [
        {
          nome: "Indique um amigo",
          descricao: "Convide um amigo para conhecer os serviços da nossa empresa. Quando seu amigo se cadastrar ou realizar uma ação específica, você será recompensado com bazicash.",
          bazicash: "500"
        },
        {
          nome: "Avalie-nos no google",
          descricao: "Tem que ter o botão do fazer agora com o link que leva para avaliação do google Também tem que ter o botão que leva para a parte de baixo (já fiz)",
          bazicash: "500"
        },
        {
          nome: "Grave um vídeo contando sobre sua experiência com o bazipass",
          descricao: "Mande-nos um vídeo de no mínimo 30 segundos contando sua experiência com o Bazipass",
          bazicash: "150"
        },
        {
          nome: "Poste um stories usando Bázico e nos marque no Instagram",
          descricao: "Compartilhe uma foto ou história no Instagram usando nossas roupas ou falando sobre sua experiência com a Bázico. Marque nossa empresa e use hashtags específicas. Após a publicação, você receberá bazicash como agradecimento pela sua contribuição para promover nossa marca.",
          bazicash: "75"
        },
        {
          nome: "Poste sobre a Bázico no LinkedIn se sua empresa já contratou nossos serviços",
          descricao: "Se sua empresa já é cliente da Bázico, compartilhe uma postagem no LinkedIn mencionando como nossos serviços beneficiaram sua empresa. Marque nossa empresa e inclua detalhes relevantes. Ao fazer isso, você será recompensado com bazicash como reconhecimento pelo seu apoio e testemunho.",
          bazicash: "100"
        },
        {
          nome: "Responda nosso questionário",
          descricao: "Participe do nosso questionário respondendo a perguntas sobre sua experiência com nossos produtos ou serviços. Suas respostas nos ajudarão a melhorar e aprimorar nossos negócios. Após concluir o questionário, você receberá bazicash como agradecimento por sua contribuição valiosa.",
          bazicash: "100"
        }
      ]
    }
  },

  computed: {
    i19addToCart: () => i18n(i19addToCart),
    i19close: () => i18n(i19close),
    i19next: () => i18n(i19next),
    i19previous: () => i18n(i19previous),
    i19selectVariationMsg: () => i18n(i19selectVariationMsg),
    i19quantity: () => i18n(i19quantity),
    i19item: () => i18n(i19item),
    i19minQuantity: () => i18n(i19minQuantity),
    i19maxQuantity: () => i18n(i19maxQuantity),

  },

  methods: {
    getImg,
    getName

  },

  watch: {

  },

}


</script>

<template>
    <div class="account-gamification">
        <ul>
          <li v-for="mission in missions">
            <span> {{ mission.nome }} </span>
            <p> {{ mission.descricao }} </p>
            <span> {{ mission.bazicash }} </span>
          </li>
        </ul>
    </div>
</template>

<style scoped>

</style>
