import {
  i19checkout,
  i19close,
  i19continueShopping,
  i19emptyCart,
  i19myShoppingCart,
  i19seeCart,
  i19subtotal
} from '@ecomplus/i18n'

import {
  i18n,
  formatMoney,
  price as getPrice
} from '@ecomplus/utils'

import ecomCart from '@ecomplus/shopping-cart'
import ALink from '@ecomplus/storefront-components/src/ALink.vue'
import ABackdrop from '@ecomplus/storefront-components/src/ABackdrop.vue'
import APrices from '@ecomplus/storefront-components/src/APrices.vue'
import CartItem from '@ecomplus/storefront-components/src/CartItem.vue'
import ShippingCalculator from '@ecomplus/storefront-components/src/ShippingCalculator.vue'

export default {
  name: 'CartQuickview',

  components: {
    ALink,
    ABackdrop,
    APrices,
    CartItem,
    ShippingCalculator
  },

  props: {
    isVisible: {
      type: Boolean,
      default: true
    },
    hasShippingCalculator: Boolean,
    checkoutUrl: {
      type: String,
      default: '/app/#/checkout'
    },
    cartUrl: {
      type: String,
      default: '/app/#/cart'
    },
    canOpenOnNewItem: {
      type: Boolean,
      default: true
    },
    ecomCart: {
      type: Object,
      default () {
        return ecomCart
      }
    }
  },

  data () {
    return {
      selectedShippingPrice: 0,
      isBazipass: false
    }
  },

  computed: {
    i19checkout: () => i18n(i19checkout),
    i19close: () => i18n(i19close),
    i19continueShopping: () => i18n(i19continueShopping),
    i19emptyCart: () => i18n(i19emptyCart),
    i19myShoppingCart: () => i18n(i19myShoppingCart),
    i19seeCart: () => i18n(i19seeCart),
    i19subtotal: () => i18n(i19subtotal),

    cart () {
      return this.ecomCart.data
    },

    total () {
      return this.cart.subtotal + this.selectedShippingPrice
    },

    canBuyBazipass () {
      let bazicasNumber = 0
      const buyer = this.ecomPassport && this.ecomPassport.customer
      this.isBazipass = buyer &&
        buyer.doc_number &&
        window.checkedBazipassDoc === buyer.doc_number
      if (this.cart.items && this.cart.items.length) {
        this.cart.items.forEach(({ categories, quantity }) => {
          if (categories) {
            const hasBazicaCategory = categories.some(({ _id }) => _id === '638eb9ba73321213f805aa1c')
            if (hasBazicaCategory) {
              bazicasNumber += quantity
            }
          }
        })
      }
      return bazicasNumber >= 5 && !this.isBazipass
    },

    economic () {
      let redux = 0
      if (this.canBuyBazipass) {
        redux = this.cart.subtotal - 600
      }
      return redux
    },

    totalBazicashPrice () {
      let bazicashPrice = 0
      this.cart.items.forEach(item => {
        if (item.flags.includes('bazicash')) {
          bazicashPrice += (getPrice(item) / (window.bazicashRatio || 0.1))
        }
      })
      console.log('bazicash price is', bazicashPrice)
      return bazicashPrice
    }
  },

  methods: {
    formatMoney,

    toggle (isVisible) {
      this.$emit(
        'update:is-visible',
        typeof isVisible === 'boolean' ? isVisible : !this.isVisible
      )
    },

    selectShippingService (service) {
      this.selectedShippingPrice = service.shipping_line
        ? service.shipping_line.total_price
        : 0
    }
  },

  created () {
    if (this.canOpenOnNewItem) {
      this.ecomCart.on('addItem', ({ data }) => {
        this.$set(this.ecomCart, 'data', data)
        this.$nextTick(() => {
          this.toggle(true)
        })
      })
    }
  }
}
