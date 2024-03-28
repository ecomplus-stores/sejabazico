import {
  i19available,
  i19loyaltyPoints,
  i19pointsEarned,
  i19upTo
} from '@ecomplus/i18n'

import {
  i18n,
  formatDate,
  formatMoney
} from '@ecomplus/utils'

export default {
  name: 'AccountGamification',

  props: {
    customer: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  computed: {
    i19available: () => i18n(i19available),
    i19loyaltyPoints: () => i18n(i19loyaltyPoints),
    i19pointsEarned: () => i18n(i19pointsEarned),
    i19upTo: () => i18n(i19upTo),

    purchases () {
      return window.ecomPassport && window.ecomPassport.customer && window.ecomPassport.customer.orders && window.ecomPassport.customer.orders || []
    },

    checkPrimaryColorsOwned() {
      const orders = this.purchases();
      let hasYellow = false, hasRed = false, hasBlue = false;
  
      for (const order of orders) {
          for (const item of order.items) {
              if (this.skus.Yellow.includes(item.sku)) {
                  hasYellow = true;
              }
              if (this.skus.Red.includes(item.sku)) {
                  hasRed = true;
              }
              if (this.skus.Blue.includes(item.sku)) {
                  hasBlue = true;
              }
          }
      }

      this.missingColors = [];
      if (!hasYellow) this.missingColors.push('Yellow');
      if (!hasRed) this.missingColors.push('Red');
      if (!hasBlue) this.missingColors.push('Blue');
  
      if (this.missingColors.length > 0) {
          console.log('Faltando cores primárias:', this.missingColors.join(', '));
      } else {
          console.log('Parabéns! Você possui camisas de todas as cores primárias.');
      }
      
      return hasYellow && hasRed && hasBlue;  // Retorne verdadeiro se todas as cores estiverem presentes, falso caso contrário
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
    formatDate,
    formatMoney
  }
}
