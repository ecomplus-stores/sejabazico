<script>

import {
  nickname as getNickname
} from '@ecomplus/utils'

export default {
  name: 'AccountSummaryBazicash',

  props: {
  },

  data () {
    return {
      customer: window.ecomPassport && window.ecomPassport.customer
    }
  },

  computed: {

    nickname () {
      return getNickname(this.customer) || 'seus Bázicos'
    },

    bazipassDoc () {
      return window.checkedBazipassDoc
    },

    nameCustomer () {
      if (this.bazipassDoc || Number(window.sessionStorage.getItem('isBazipass'))) {
        return `E ai, ${this.nickname}, curtindo muito o BaziPass?`
      }
      return `E ai ${this.nickname}`
    },

    points () {
      if (this.customer && this.customer.loyalty_points_entries && this.customer.loyalty_points_entries.length) {
        return this.customer.loyalty_points_entries.reduce((acc, next) => {
          const now = new Date()
          const entryPointsValidThru = new Date(next.valid_thru)
          if (now.getTime() <= entryPointsValidThru.getTime()) {
            return acc + next.active_points
          }
        }, 0)
      }
      return 0
    }

  },

  methods: {
    getNickname

  },

}


</script>

<template>
    <div class="account-summary-bazicash">
      <div class="has-points" v-if="points">
        <p>{{ nameCustomer }}</p>
        <span>Saldo: <strong>{{ points }} Bazicash</strong></span>
      </div>
      <div v-else>
        <p>{{ nameCustomer }}</p>
        <h3><a id="check-login-widget" href="/app/#/account/">Faça login na loja para verificar seu saldo</a></h3>
      </div>
        
    </div>
</template>

<style scoped>

</style>
