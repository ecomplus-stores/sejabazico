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
  name: 'AccountPoints',

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
      return window.ecomPassport && window.ecomPassport.customer && window.ecomPassport.customer.orders && window.ecomPassport.customer.orders.filter(({payment_method_label}) => payment_method_label && payment_method_label.toLowerCase() === 'bazicash') || []
    },

    validPointsEntries () {
      const pointsEntries = this.customer.loyalty_points_entries
      if (pointsEntries) {
        return pointsEntries.filter(pointsEntry => {
          const validThru = pointsEntry.valid_thru
          if (new Date(validThru).getTime() <= Date.now()) {
            pointsEntry.vencido = true
          }
          return pointsEntry.active_points >= 0
        })
      }
      return []
    },

    historyEntryPoints () {
      const pointsEntries = this.customer.loyalty_points_entries
      const allEntries = []
      if (pointsEntries) {
        pointsEntries.forEach(entry => {
          const usedPoints = entry.earned_points - entry.active_points
          if (entry.earned_points === entry.active_points) {
            allEntries.push(entry)
          } else if (entry.active_points === 0) {
            // verificar se há resgates para inserir
            allEntries.push({
              points: 'entrando',
              ...entry
            })

            allEntries.push({
              points: 'saindo',
              used_points: usedPoints,
              ...entry
            })
          } else {
            allEntries.push({
              points: 'entrando',
              ...entry
            })

            allEntries.push({
              points: 'saindo',
              used_points: usedPoints,
              ...entry
            })
          }
        })
      }
      return allEntries
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
