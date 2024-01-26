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
  img as getImg,
  randomObjectId as genRandomObjectId
} from '@ecomplus/utils'

import ecomCart from '@ecomplus/shopping-cart'
import Glide from '@glidejs/glide'
import APicture from '@ecomplus/storefront-components/src/APicture.vue'
import ProductVariations from '@ecomplus/storefront-components/src/ProductVariations.vue'
import APrices from '@ecomplus/storefront-components/src/APrices.vue'
import ALink from '@ecomplus/storefront-components/src/ALink.vue'
import AAlert from '@ecomplus/storefront-components/src/AAlert.vue'

export default {
  name: 'KitProductVariations',

  components: {
    ALink,
    AAlert,
    APicture,
    APrices,
    ProductVariations
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: Number,
    maxOptionsBtns: {
      type: Number,
      default: 10
    },
    slug: String,
    buyText: String,
    kitProductId: String,
    kitName: String,
    kitPrice: Number,
    canAddToCart: {
      type: Boolean,
      default: true
    },
    glideOptions: {
      type: Object,
      default () {
        return {
          type: 'slider',
          autoplay: false,
          rewind: false
        }
      }
    }
  },

  data () {
    return {
      glide: null,
      activeIndex: 0,
      selectedVariationId: null,
      variationKit: [],
      variationKitReady: [],
      alertVariant: 'warning'
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

    localItems () {
      const products = []
      for (let index = 0; index < this.items.length; index++) {
        if (this.items && this.items.length === this.min) {
          const itemObject = Object.assign({}, this.items[index])
          itemObject.key = genRandomObjectId()
          if (!(this.items[index].variations && this.items[index].variations.length)) {
            this.variationKit[index] = this.items[index]._id
          }
          products.push(itemObject)
        } else {
          for (let i = 0; i < this.min; i++) {
            const itemObject = Object.assign({}, this.items[index])
            itemObject.key = genRandomObjectId()
            products.push(itemObject)
          }
        }
      }
      return products
    }

  },

  methods: {
    getImg,
    getName,

    moveSlider (index) {
      this.activeIndex = index
      if (this.glide) {
        this.glide.go('=' + index)
      }
    },

    removeItemFromKit (index) {
      this.variationKit.splice(index, 1)
      this.localItems[index].key = genRandomObjectId()
      this.selectedVariationId = null
      this.variationKitReady = this.variationKit.filter(n => n)
    },

    buy () {
      this.alertVariant = 'warning'
      if (this.variationKitReady.length === this.min) {
        if (this.max === undefined || this.variationKitReady.length <= this.max) {
          const items = []
          const composition = []
          this.variationKitReady.forEach(variationId => {
            const product = this.items.find(item => {
              const variation = item.variations && item.variations.find(variation => variation._id === variationId)
              if (variation) {
                items.push({
                  ...item,
                  ...variation,
                  variation_id: variation._id
                })
                return item
              } else if (!(item.variations && item.variations.length)) {
                items.push({
                  ...item
                })
                return item
              }
            })
            if (product) {
              composition.push({
                _id: product.product_id,
                variation_id: variationId,
                quantity: 1
              })
            }
          })

          items.forEach(item => {
            const newItem = { ...item, quantity: 1 }
            delete newItem.customizations
            if (this.kitProductId) {
              newItem.kit_product = {
                _id: this.kitProductId,
                name: this.kitName,
                pack_quantity: this.min,
                price: this.kitPrice,
                composition
              }
            }
            if (this.slug) {
              newItem.slug = this.slug
            }
            if (this.canAddToCart) {
              ecomCart.addItem(newItem)
            }
          })
          this.$emit('buy', { items })
        }
      }
    }
  },

  watch: {
    activeIndex (index, oldIndex) {
      if (index < this.localItems.length && index > -1) {
        this.moveSlider(index)
      } else {
        this.moveSlider(oldIndex)
      }
      this.selectedVariationId = null
    },

    selectedVariationId (current) {
      if (current && this.activeIndex >= 0 && (this.variationKitReady.length < this.min || this.variationKit[this.activeIndex])) {
        this.variationKit[this.activeIndex] = current
        this.variationKitReady = this.variationKit.filter(n => n)
      }
    }
  },

  mounted () {
    const glide = new Glide(this.$refs.glide, this.glideOptions)
    glide.on('run', () => {
      this.moveSlider(glide.index)
    })
    glide.mount()
    this.glide = glide
  },

  beforeDestroy () {
    if (this.glide) {
      this.glide.destroy()
    }
  }
}


</script>

<template>
    <div class="kit-product-variations">
        <div class="glide" ref="glide">
            <div class="glide__track" data-glide-el="track">
                <ul class="glide__slides kit-product-variations__list">
                    <li v-for="(item, index) in localItems" class="glide__slide">
                        <button v-if="variationKit[activeIndex]" @click="removeItemFromKit(activeIndex)" type="button"
                            :aria-label="i19close" class="close">
                            <i class="i-times-circle"></i>
                        </button>
                        <div class="kit-product-variations__item">
                            <div class="kit-product-variations__item-head">
                                <div class="kit-product-variations__picture">
                                    <a-picture class="gallery__big-image" :src="getImg(item, null, 'normal')" />
                                </div>
                                <div class="kit-product-variations__info">
                                    <h2>{{ getName(item) }}</h2>
                                    <b>{{ i19quantity }}: 1 </b>
                                </div>
                            </div>

                            <slot name="variations" v-if="item.variations && item.variations.length">
                                <product-variations :key="item.key" :product="item" :selected-id.sync="selectedVariationId"
                                    :max-options-btns="maxOptionsBtns" />

                                <slot name="variations-info" />
                            </slot>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="glide__pagination">
                <span class="glide__pagination--current">{{ activeIndex + 1 }}</span>
                <span class="glide__pagination--total">/ {{ localItems.length }}</span>
            </div>
        </div>
        <div class="kit-product-variations__actions">
            <button @click="activeIndex++" class="btn btn-block btn-primary"><span>{{ i19next }} {{ i19item
            }}</span></button>
            <button @click="activeIndex--" class="btn btn-block btn-outline-secondary">
                <span>{{ i19item }} {{ i19previous }}</span>
            </button>
        </div>
        <div class="kit-product-variations__buy">
            <slot name="buy" v-bind="{ variationKit }">
                <button type="button" class="btn btn-lg btn-primary my-3" @click="buy"
                    :disabled="variationKitReady.length !== min">
                    <slot name="buy-button-content">
                        <i class="i-shopping-bag mr-1"></i>
                    </slot>
                </button>
            </slot>
        </div>
    </div>
</template>

<style scoped>
.kit-product-variations {
  max-width: 350px;
  &__item {
    display: flex;
    align-items:flex-start;
    overflow-x: hidden;
    flex-direction: column;
    margin-bottom: .5rem;
    max-width: 350px;

    a {
      color: inherit;
    }

    picture {
      flex: 0 0 115px;
      width: 115px;
      height: auto;
      margin-right: .5rem;

      img {
        border-radius: var(--border-radius);
      }
    }

    small {
      line-height: 1.3;
      display: inline-block;
    }
  }

  &__info {
    h2 {
      font-size: var(--font-size-sm);
    }
  }

  &__item-head {
    display: flex;
  }

  &__info {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }

  &__buy {
    button {
      width: 100%;
    }
  }

  &__actions {
    button {
      text-transform: uppercase;
    }
  }

  .glide__pagination {
    text-align: center;
    padding-bottom: 10px;
  }

  &--hide {
    display: none !important;
  }

  &--show {
    margin-left: 3px;
  }
}

</style>
