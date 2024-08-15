import {
  i19add$1ToEarn,
  i19calculateShipping,
  i19freeShipping,
  i19zipCode
} from '@ecomplus/i18n'

import {
  $ecomConfig,
  i18n,
  price as getPrice,
  formatMoney
} from '@ecomplus/utils'

import { modules } from '@ecomplus/client'
import sortApps from '@ecomplus/storefront-components/src/js/helpers/sort-apps'
import CleaveInput from 'vue-cleave-component'
import ShippingLine from '@ecomplus/storefront-components/src/ShippingLine.vue'
import ecomPassport from '@ecomplus/passport-client'
import ecomCart from '@ecomplus/shopping-cart'

const localStorage = typeof window === 'object' && window.localStorage
const zipStorageKey = 'shipping-to-zip'

const reduceItemBody = itemOrProduct => {
  const shippedItem = {}
  ;[
    'product_id',
    'variation_id',
    'sku',
    'name',
    'quantity',
    'inventory',
    'currency_id',
    'currency_symbol',
    'price',
    'final_price',
    'dimensions',
    'weight'
  ].forEach(field => {
    if (itemOrProduct[field] !== undefined) {
      shippedItem[field] = itemOrProduct[field]
    }
  })
  return shippedItem
}

export default {
  name: 'ShippingCalculator',

  components: {
    CleaveInput,
    ShippingLine
  },

  props: {
    zipCode: String,
    canSelectServices: Boolean,
    isSubscription: Boolean,
    canInputZip: {
      type: Boolean,
      default: true
    },
    countryCode: {
      type: String,
      default: $ecomConfig.get('country_code')
    },
    shippedItems: {
      type: Array,
      default () {
        return []
      }
    },
    shippingResult: {
      type: Array,
      default () {
        return []
      }
    },
    shippingData: {
      type: Object,
      default () {
        return {}
      }
    },
    skipAppIds: Array,
    shippingAppsSort: {
      type: Array,
      default () {
        return window.ecomShippingApps || []
      }
    }
  },

  data () {
    return {
      localZipCode: null,
      localShippedItems: [],
      amountSubtotal: null,
      shippingServices: [],
      selectedService: null,
      hasPaidOption: false,
      freeFromValue: null,
      isBazipass: true,
      isScheduled: false,
      retryTimer: null,
      isWaiting: false,
      hasCalculated: false
    }
  },

  computed: {
    i19add$1ToEarn: () => i18n(i19add$1ToEarn),
    i19calculateShipping: () => i18n(i19calculateShipping),
    i19zipCode: () => i18n(i19zipCode),
    i19freeShipping: () => i18n(i19freeShipping).toLowerCase(),

    cleaveOptions () {
      return this.countryCode === 'BR'
        ? { blocks: [5, 3], delimiter: '-' }
        : { blocks: [30] }
    },

    customerData () {
      return ecomPassport && ecomPassport.customer
    },

    isAracaju () {
      return this.localZipCode >= 49000000 && this.localZipCode <= 49099999
    },

    isBazicashFirstRescue () {
      return this.customerData && this.customerData.orders && this.customerData.orders.length && this.customerData.orders.some(({payment_method_label}) => payment_method_label === "Bazicash")
    },

    freeFromPercentage () {
      return this.hasPaidOption && this.amountSubtotal < this.freeFromValue
        ? Math.round(this.amountSubtotal * 100 / this.freeFromValue)
        : null
    },

    bazipassItem () {
      return ecomCart && ecomCart.data && ecomCart.data.items && ecomCart.data.items.length && ecomCart.data.items.every(({ name }) => name && name.toLowerCase().includes('bazipass'))
    },

    bazicashItem () {
      return ecomCart && ecomCart.data && ecomCart.data.items && ecomCart.data.items.length && ecomCart.data.items.every(({ flags }) => flags && flags.includes('bazicash'))
    },

    shippingServicesFinal () {
      const date = new Date()
      const today = date.getDay()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const fifteenHalf = hour === 15 && minutes <= 30
      const isBetweenHours = today >= 1 && today <= 5 && hour >= 8 && (hour < 15 || fifteenHalf) || (today === 6 && hour >= 9 && hour <= 11)
      console.log('is subs', (this.isSubscription || this.bazipassItem))
      return (this.isSubscription || this.bazipassItem) 
        ? this.shippingServices.filter(service => service.app_id === 1253 && service.service_code === 'bazipass')
        : this.shippingServices.filter(service => {
          if ((this.isBazipass && this.bazicashItem) && service && service.service_code.includes('BAZICASH-')) {
            if (this.isBazicashFirstRescue && service.service_code === 'BAZICASH-1') {
              return service
            } else if (!this.isBazicashFirstRescue && service.service_code === 'BAZICASH-0') {
              return service
            } else {
              return null
            }
          } else if (service && service.service_code.includes('BAZICASH-')) {
            return null
          }
          if (!isBetweenHours) {
            return service.service_code !== 'express'
          } else {
            return service
          }
        })
    },

    productionDeadline () {
      let maxDeadline = 0
      this.shippedItems.forEach(item => {
        if (item.quantity && item.production_time) {
          const { days, cumulative } = item.production_time
          const itemDeadline = cumulative ? days * item.quantity : days
          if (itemDeadline > maxDeadline) {
            maxDeadline = itemDeadline
          }
        }
      })
      return maxDeadline
    }
  },

  methods: {
    formatMoney,

    updateZipCode () {
      this.$emit('update:zip-code', this.localZipCode)
    },

    parseShippingOptions (shippingResult = [], isRetry = false) {
      this.freeFromValue = null
      this.shippingServices = []
      if (shippingResult.length) {
        shippingResult.forEach(appResult => {
          const { validated, error, response } = appResult
          if (!validated || error) {
            return
          }
          if (
            this.skipAppIds &&
            this.skipAppIds.includes(appResult.app_id) &&
            shippingResult.filter(({ app_id: appId }) => !this.skipAppIds.includes(appId)).length
          ) {
            return
          }
          response.shipping_services.forEach(service => {
            if(service.service_code && service.service_code.includes('PROPRIA-')) {
              const date = new Date()
              const today = date.getDay()
              const hour = date.getHours()
              console.log(hour)
              if (today > 0 && today < 6 && hour < 18 && service.service_code && service.service_code.includes('PROPRIA-1')) {
                this.shippingServices.push({
                  app_id: appResult.app_id,
                  ...service
                })
              } else if (today === 6 && hour < 13 && service.service_code && service.service_code.includes('PROPRIA-1')) {
                this.shippingServices.push({
                  app_id: appResult.app_id,
                  ...service
                })
              } else if (today > 0 && today < 6 && hour >= 18 && service.service_code && service.service_code.includes('PROPRIA-2')) {
                this.shippingServices.push({
                  app_id: appResult.app_id,
                  ...service
                })
              } else if (((today === 6 && hour >= 13) || (today === 0)) && service.service_code && service.service_code.includes('PROPRIA-3')) {
                this.shippingServices.push({
                  app_id: appResult.app_id,
                  ...service
                })
              }
            } else {
              this.shippingServices.push({
                app_id: appResult.app_id,
                ...service
              })
            }
          })
          const freeShippingFromValue = response.free_shipping_from_value
          if (
            freeShippingFromValue &&
            (!this.freeFromValue || this.freeFromValue > freeShippingFromValue)
          ) {
            this.freeFromValue = freeShippingFromValue
          }
        })
        if (!this.shippingServices.length) {
          if (!isRetry) {
            this.fetchShippingServices(true)
          } else {
            this.scheduleRetry()
          }
        } else {
          this.shippingServices = this.shippingServices.sort((a, b) => {
            const priceDiff = a.shipping_line.total_price - b.shipping_line.total_price
            return priceDiff < 0
              ? -1
              : priceDiff > 0
                ? 1
                : a.shipping_line.delivery_time && b.shipping_line.delivery_time &&
                  a.shipping_line.delivery_time.days < b.shipping_line.delivery_time.days
                  ? -1
                  : 1
          })

          this.hasPaidOption = Boolean(this.shippingServices.find(service => {
            return service.shipping_line.total_price || service.shipping_line.price
          }))
          if (Array.isArray(this.shippingAppsSort) && this.shippingAppsSort.length) {
            this.shippingServices = sortApps(this.shippingServices, this.shippingAppsSort)
          }
          if (this.isAracaju && !this.bazipassItem) {
            const indexMotoboy = this.shippingServices.findIndex(service => service.service_code === 'PROPRIA-1')
            this.setSelectedService(indexMotoboy)
          } else {
            this.setSelectedService(0)
          }
        }
      }
    },

    scheduleRetry (timeout = 10000) {
      clearTimeout(this.retryTimer)
      this.retryTimer = setTimeout(() => {
        if (this.localZipCode && !this.shippingServices.length && this.shippedItems.length) {
          this.fetchShippingServices(true)
        }
      }, timeout)
    },

    fetchShippingServices (isRetry) {
      if (!this.isScheduled) {
        this.isScheduled = true
        setTimeout(() => {
          this.isScheduled = false
          const { storeId } = this
          let url = '/calculate_shipping.json'
          if (this.skipAppIds && this.skipAppIds.length) {
            url += '?skip_ids='
            this.skipAppIds.forEach((appId, i) => {
              if (i > 0) url += ','
              url += `${appId}`
            })
          }
          const method = 'POST'
          const data = {
            ...this.shippingData,
            to: {
              zip: this.localZipCode,
              ...this.shippingData.to
            }
          }
          if (this.localShippedItems.length) {
            data.items = this.localShippedItems
            data.subtotal = this.amountSubtotal
          }
          this.isWaiting = true
          modules({ url, method, storeId, data })
            .then(({ data }) => this.parseShippingOptions(data.result, isRetry))
            .catch(err => {
              if (!isRetry) {
                this.scheduleRetry(4000)
              }
              console.error(err)
            })
            .finally(() => {
              this.hasCalculated = true
              this.isWaiting = false
            })
        }, this.hasCalculated ? 150 : 50)
      }
    },

    submitZipCode () {
      this.updateZipCode()
      if (localStorage) {
        localStorage.setItem(zipStorageKey, this.localZipCode)
      }
      this.fetchShippingServices()
    },

    setSelectedService (i) {
      if (this.canSelectServices) {
        this.$emit('select-service', this.shippingServices[i])
        this.selectedService = i
        const eventLayer = window.dataLayer.find(({event}) => event === 'eec.checkout')
        window.dataLayer.push({
          event: 'add_shipping_info',
          ecommerce: {
            currency: 'BRL',
            shipping_method: this.shippingServices[i] && this.shippingServices[i].label,
            value: this.shippingServices[i] && this.shippingServices[i].shipping_line && this.shippingServices[i].shipping_line.total_price,
            items: eventLayer && eventLayer.ecommerce && eventLayer.ecommerce.checkout && eventLayer.ecommerce.checkout.products
          }
        })
      }
    }
  },

  watch: {
    shippedItems: {
      handler () {
        setTimeout(() => {
          this.localShippedItems = this.shippedItems.map(reduceItemBody)
          const { amountSubtotal } = this
          this.amountSubtotal = this.shippedItems.reduce((subtotal, item) => {
            return subtotal + getPrice(item) * item.quantity
          }, 0)
          if (
            this.hasCalculated &&
            (this.canSelectServices || amountSubtotal !== this.amountSubtotal ||
              (!this.shippingServices.length && !this.isWaiting))
          ) {
            this.fetchShippingServices()
          }
        }, 50)
      },
      deep: true,
      immediate: true
    },

    localZipCode (zipCode) {
      if (this.countryCode === 'BR' && zipCode.replace(/\D/g, '').length === 8) {
        this.submitZipCode()
      }
    },

    zipCode: {
      handler (zipCode) {
        if (zipCode) {
          this.localZipCode = zipCode
        }
      },
      immediate: true
    },

    skipAppIds () {
      this.fetchShippingServices()
    },

    shippingResult: {
      handler (result) {
        if (result.length) {
          this.parseShippingOptions(result)
        }
      },
      immediate: true
    }
  },

  created () {
    const checkBazipass = () => {
      const buyer = ecomPassport && ecomPassport.customer
      this.isBazipass = /* buyer.doc_number &&
        window.checkedBazipassDoc === buyer.doc_number */ true
    }
    window.addEventListener('bazipassCheck', checkBazipass)
    checkBazipass()
    if (!this.zipCode && localStorage) {
      const storedZip = localStorage.getItem(zipStorageKey)
      if (storedZip) {
        this.localZipCode = storedZip
      }
    }
  }
}
