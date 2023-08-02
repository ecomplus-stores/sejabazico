import {
  i19freebie,
  i19outOfStock,
  i19quantity,
  i19remove
} from '@ecomplus/i18n'

import {
  i18n,
  img as getImg,
  price as getPrice,
  formatMoney
} from '@ecomplus/utils'

import ecomCart from '@ecomplus/shopping-cart'
import ALink from '@ecomplus/storefront-components/src/ALink.vue'
import APicture from '@ecomplus/storefront-components/src/APicture.vue'
import ItemCustomizations from '@ecomplus/storefront-components/src/ItemCustomizations.vue'

export default {
  name: 'CartItem',

  components: {
    ALink,
    APicture,
    ItemCustomizations
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    nameMaxLength: {
      type: Number,
      default: 35
    },
    inputType: {
      type: String,
      default: 'select'
    },
    canUpdateCart: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      quantity: 0,
      canInputSelect: false,
      isAsideVisible: false
    }
  },

  computed: {
    i19freebie: () => i18n(i19freebie),
    i19outOfStock: () => i18n(i19outOfStock),
    i19quantity: () => i18n(i19quantity),
    i19remove: () => i18n(i19remove),

    itemId () {
      return this.item._id
    },

    price () {
      return this.item.final_price || getPrice(this.item)
    },

    img () {
      return getImg(this.item.picture || this.item, null, 'small')
    },

    name () {
      return this.formatName(this.item.name)
    },

    isFreebie () {
      return Array.isArray(this.item.flags)
        ? this.item.flags.includes('freebie')
        : false
    },

    isIntegerQnt () {
      return Number.isInteger(this.maxQuantity) && Number.isInteger(this.quantity)
    },

    minQuantity () {
      const minQuantity = this.item.min_quantity
      return typeof minQuantity === 'number' && minQuantity >= 0
        ? minQuantity
        : 1
    },

    maxQuantity () {
      if (this.item.available === false) {
        return 0
      }
      const maxQuantity = this.item.max_quantity
      return typeof maxQuantity === 'number' && maxQuantity >= 0
        ? maxQuantity
        : 9999999
    },

    messageFather () {
      const { customizations } = this.item
      if (Array.isArray(customizations) && customizations.length) {
        const custom = customizations.find(customization => customization.label === 'É presente?')
        if (Object.keys(custom).length) {
          return custom.option && custom.option.text
        }
        return null
      }
      return null
    },

    checkMessage () {
      if (this.messageFather && this.messageFather.length) {
        this.isAsideVisible = true
        return this.isAsideVisible
      }
      return false
    }
  },

  methods: {
    formatMoney,

    formatName (name) {
      if (name) {
        if (name.length <= this.nameMaxLength) {
          return name
        } else {
          return `${name.substr(0, this.nameMaxLength)}...`
        }
      }
    },

    validateQuantity () {
      if (this.minQuantity <= this.maxQuantity) {
        if (this.quantity < this.minQuantity) {
          this.quantity = this.minQuantity
        } else if (this.quantity > this.maxQuantity) {
          this.quantity = this.maxQuantity
        }
      }
    },

    updateInputType () {
      this.validateQuantity()
      this.canInputSelect = this.isIntegerQnt && this.quantity > 0 && this.quantity <= 10
    },

    remove () {
      this.$emit('remove')
      if (this.itemId && this.canUpdateCart) {
        this.quantity = 0
        this.canInputSelect = false
        this.$nextTick(() => {
          ecomCart.removeItem(this.itemId)
          this.$destroy()
        })
      }
    },

    setCustomizationOption (text) {
      const customization = {
        _id: '6493010c5e6069037042dc97',
        label: 'É presente?',
        grid_id: 'e_presente'
      }
      if (!this.item.customizations) {
        this.item.customizations = []
      }
      const index = this.item.customizations.findIndex(({ _id }) => _id === customization._id)
      if (text) {
        if (index > -1) {
          this.item.customizations[index].option = { text }
        } else {
          this.item.customizations.push({
            _id: customization._id,
            label: customization.label,
            option: { text }
          })
        }
      } else if (index > -1) {
        this.item.customizations.splice(index, 1)
      }
      ecomCart.save()
    },

    toggleInput (isVisible) {
      const check = isVisible.target && isVisible.target.checked
      if (!check) {
        this.setCustomizationOption('')
      }
      this.isAsideVisible = check
    },
  },

  watch: {
    'item.quantity': {
      handler (qnt) {
        if (this.quantity || qnt > 1) {
          this.quantity = qnt || 0
        }
      },
      immediate: true
    },

    quantity (qnt, oldQnt) {
      if (typeof qnt !== 'number' || isNaN(qnt)) {
        qnt = 0
      }
      if (qnt !== this.item.quantity) {
        const quantityToAdd = qnt - this.item.quantity
        this.$emit('increase', {
          quantityToAdd,
          newQuantity: qnt
        })
        if (this.itemId && this.canUpdateCart) {
          const item = ecomCart.increaseItemQnt(this.itemId, quantityToAdd)
          if (this.isFreebie) {
            item.flags = item.flags.filter(flag => !flag.startsWith('freebie'))
          }
        }
      }
      if (qnt > 10 && oldQnt <= 10) {
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.$refs.input.focus()
          }
        })
      }
    }
  },

  created () {
    this.updateInputType()
  }
}
