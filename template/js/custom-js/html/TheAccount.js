import {
  i19addresses,
  i19favorites,
  i19hello,
  i19isNotYou,
  i19logout,
  i19noSavedFavoritesMsg,
  i19orders,
  i19registration,
  i19subscriptions
} from '@ecomplus/i18n'

import {
  i18n,
  nickname as getNickname
} from '@ecomplus/utils'

import ecomPassport from '@ecomplus/passport-client'
import LoginBlock from '@ecomplus/storefront-components/src/LoginBlock.vue'
import RecommendedItems from '@ecomplus/storefront-components/src/RecommendedItems.vue'

export default {
  name: 'TheAccount',

  components: {
    LoginBlock,
    RecommendedItems
  },

  props: {
    customer: {
      type: Object,
      default () {
        return {}
      }
    },
    currentTab: {
      type: String,
      validator: function (value) {
        return ['orders', 'favorites', 'subscriptions', 'points', 'gamification', 'account'].includes(value)
      }
    },
    ecomPassport: {
      type: Object,
      default () {
        return ecomPassport
      }
    }
  },

  data () {
    return {
      favoriteIds: [],
      navTabs: [],
      hasBazipass: false,
      hello: null
    }
  },

  computed: {
    i19addresses: () => i18n(i19addresses),
    i19favorites: () => i18n(i19favorites),
    i19hello: () => i18n(i19hello),
    i19isNotYou: () => i18n(i19isNotYou),
    i19logout: () => i18n(i19logout),
    i19noSavedFavoritesMsg: () => i18n(i19noSavedFavoritesMsg),
    i19orders: () => i18n(i19orders),
    i19subscriptions: () => i18n(i19subscriptions),
    i19registration: () => i18n(i19registration),

    activeTab: {
      get () {
        return this.currentTab || 'account'
      },
      set (tab) {
        this.$emit('update:current-tab', tab)
      }
    },

    bazipassDoc () {
      return window.checkedBazipassDoc
    },

    localCustomer: {
      get () {
        return this.customer
      },
      set (customer) {
        this.$emit('update:customer', customer)
      }
    },

    nickname () {
      return getNickname(this.customer)
    },

    helloPhrase: {
      get () {
        if (this.bazipassDoc || Number(window.sessionStorage.getItem('isBazipass'))) {
          return `E ai, ${this.nickname}, curtindo muito o BaziPass?`
        }
        this.$nextTick(() => {
          if (this.bazipassDoc || window.checkedBazipassDoc) {
            return `E ai, ${this.nickname}, curtindo muito o BaziPass?`
          }
          return `Olá ${this.nickname}`
        })
        return `Olá ${this.nickname}`
      },
      set (bazipassDoc) {
        if (bazipassDoc) {
          return `E ai, ${this.nickname}, curtindo muito o BaziPass?`
        }
        this.$nextTick(() => {
          if (this.bazipassDoc || window.checkedBazipassDoc) {
            return `E ai, ${this.nickname}, curtindo muito o BaziPass?`
          }
          return `Olá ${this.nickname}`
        })
        return `Olá ${this.nickname}`
      }
    }
  },

  methods: {
    hasTab (tabValue) {
      return this.navTabs.some(tab => tab.value === tabValue)
    },

    insertSubscriptionTab () {
      const hasSubscriptions = this.hasTab('subscriptions')
      if (this.ecomPassport.checkAuthorization() && !hasSubscriptions) {
        this.ecomPassport.requestApi('/orders.json?transactions.type=recurrence&limit=1&fields=_id')
          .then(({ data }) => {
            const { result } = data
            if (result.length) {
              this.navTabs.push({
                label: this.i19subscriptions,
                value: 'subscriptions'
              })
            }
          })
          .catch(console.error)
      }
    },

    login (ecomPassport) {
      if (ecomPassport.checkAuthorization()) {
        this.localCustomer = ecomPassport.getCustomer()
        this.$emit('login', ecomPassport)
      }
    },

    logout () {
      if (this.ecomPassport.checkLogin()) {
        this.ecomPassport.logout()
        this.$emit('logout')
      }
    }
  },

  watch: {
    customer: {
      handler (customer) {
        const hasPoints = this.hasTab('points')
        if (Array.isArray(customer.loyalty_points_entries) && customer.loyalty_points_entries.length && !hasPoints) {
          this.navTabs.push({
            label: 'Bazicash',
            value: 'points'
          })
        }
      },
      immediate: true,
      deep: true
    },

    bazipassDoc: {
      handler (old, current) {
        console.log('bazipassdoc:', old, current)
      },
      immediate: true
    }
  },

  created () {
    this.navTabs = [
      {
        label: this.i19registration,
        value: 'account'
      },
      {
        label: this.i19orders,
        value: 'orders'
      },
      {
        label: this.i19favorites,
        value: 'favorites'
      },
      {
        label: 'Bazicash',
        value: 'points'
      },
      {
        label: 'Gamification',
        value: 'gamification'
      }
    ]
    const { favorites } = this.ecomPassport.getCustomer()
    this.favoriteIds = favorites || []
    this.insertSubscriptionTab()
    this.ecomPassport.on('login', this.insertSubscriptionTab)
    this.$once('hook:beforeDestroy', () => {
      this.ecomPassport.off('login', this.insertSubscriptionTab)
    })
    this.$nextTick(() => {
      if (this.localCustomer.doc_number) {
        window.axios.get(
          'https://us-central1-app-bazicash.cloudfunctions.net/app/check-bazipass' +
          `?doc=${this.localCustomer.doc_number}`
        )
          .then(({ data }) => {
            if (data.hasBazipass) {
              console.log(data)
              window.checkedBazipassDoc = this.localCustomer.doc_number
              this.bazipassDoc = this.localCustomer.doc_number
              window.sessionStorage.setItem('isBazipass', 1)
              window.dispatchEvent(new Event('bazipassCheck'))
              this.hello = `E ai, ${this.nickname}, curtindo muito o BaziPass?`
            }
          })
          .catch(console.error)
      }
    })
    
  }
}
