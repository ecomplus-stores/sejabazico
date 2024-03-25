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
  i19maxQuantity,
  i19available,
  i19loyaltyPoints,
  i19pointsEarned,
  i19upTo
  
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
    customer: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  



  data() {
    return {
      Nome: "User",
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
      ],
      skus: {
        Yellow: ['BZLOYE', 'BZGVYE', 'BZGCYE'],
        Red: ['BZGVBO', 'BZGVVE', 'BZLGBO', 'BZGCVE', 'BZLOVE', 'BZGCRE'],
        Blue: ['BZLGAE', 'BZGVOC', 'BZLGOC', 'BCGCWA', 'BZGCOC', 'BZGCAL', 'BZGVAL', 'BZLOAL', 'KIDS-OCEAN', 'BZGCAE', 'BZGCAM', 'BZLGAM', 'KIDS-AZUL', 'BZGVAE', 'BZGVAM', 'BZFCAE', 'BZFVAE'],
      },
      missingColors: [],
    };
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
   i19available: () => i18n(i19available),
   i19loyaltyPoints: () => i18n(i19loyaltyPoints),
   i19pointsEarned: () => i18n(i19pointsEarned),
    i19upTo: () => i18n(i19upTo),

  
  

   purchases () {
        return window.ecomPassport && window.ecomPassport.customer && window.ecomPassport.customer.orders && window.ecomPassport.customer.orders.filter(({payment_method_label}) => payment_method_label && payment_method_label.toLowerCase() === 'bazicash') || []
      },

   validPointsEntries () {
     const pointsEntries = this.customer.loyalty_points_entries
     if (pointsEntries) {
       return pointsEntries.filter(pointsEntry => {
         const validThru = pointsEntry.valid_thru
         return (!validThru || new Date(validThru).getTime() >= Date.now()) &&
           pointsEntry.active_points > 0
       })
     }
     return []
   },


   totalPoints () {
     if (this.validPointsEntries.length) {
       return this.validPointsEntries.reduce((prev, curr) => (prev + curr.active_points), 0)
     }
     return 0
   },


   totalBazicash () {
     if (this.validPointsEntries.length) {
       return this.validPointsEntries.reduce((prev, curr) => (prev + (curr.active_points * curr.ratio)), 0)
     }
     return 0
   }
 },

  methods: {
    getImg,
    getName,
    checkCustomerOrders() {
      console.log(customer);
      const orders = customer.orders || [];
      console.log(orders);
      const ownedColors = { Yellow: false, Red: false, Blue: false };

      orders.forEach(order => {
        order.items.forEach(item => {
          for (const [color, skus] of Object.entries(this.skus)) {
            if (skus.includes(item.sku)) {
              ownedColors[color] = true;
              break;
            }
          }
        });
      });

      this.missingColors = Object.keys(ownedColors).filter(color => !ownedColors[color]);
    },
    
    
  },
 
}

</script>

<template>
  <div class="account-gamification">
    <h1 class="Pontos">{{ customer.display_name }}, você tem {{ totalPoints }} Bazicash!</h1>
    <br>
    
    {{ customer.orders }}
    <h2 class="titulo-missoes">Missões 🚀</h2>
    <p class="paragrafo-lg">Participe e ganhe bazicash para trocar por produtos incríveis!</p>
   <div class="missoes">
    {{ pedido }}
     <div class="row">
       <div v-for="mission in missions" :key="mission.nome" class="col-md-6 mb-3">
         <div class="card">
           <div class="card-body">
             <h5 class="card-title">{{ mission.nome }}</h5>
             <p class="card-text">{{ mission.descricao }}</p>
             <a href="#" class="btn btn-primary">Ganhe {{ mission.bazicash }} bazicash</a>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>


<style>
.account-gamification {
 font-family: 'Montserrat', sans-serif;
 display: flex;
 flex-direction: column;
 align-items: center;
 margin-top: 20px;
}


.titulo-missoes {
 margin-bottom: 20px;
}


.paragrafo-lg {
 margin-bottom: 20px;
}


.missoes {
 display: flex;
 flex-direction: column;
 align-items: center;
}


.row {
 display: flex;
 flex-wrap: wrap;
 margin-right: -15px;
 margin-left: -15px;
}


.col-md-6 {
 position: relative;
 width: 100%;
 min-height: 1px;
 padding-right: 15px;
 padding-left: 15px;
}


.mb-3 {
 margin-bottom: 1rem!important;
}


.card {
 box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
 transition: 0.3s;
 width: 100%;
}


.card:hover {
 box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}


.card-body {
 padding: 16px;
 display: flex;
 flex-direction: column;
 align-items: center;
}


.card-title {
 font-size: 20px;
 margin-bottom: 15px;
}


.card-text {
 font-size: 16px;
 margin-bottom: 15px;
}


.btn-primary {
 background-color: #754ea9;
 color: white;
 border: none;
 padding: 10px 20px;
 text-align: center;
 text-decoration: none;
 display: inline-block;
 font-size: 16px;
 margin: 4px 2px;
 transition-duration: 0.4s;
 cursor: pointer;
}


.btn-primary:hover {
 background-color: white;
 color: black;
 border: 1px solid #754ea9;
}


.Pontos {
 font-family: 'Montserrat', sans-serif;


}


</style>
