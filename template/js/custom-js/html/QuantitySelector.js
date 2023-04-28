import {
    i19buyKit,
    i19maxQuantity,
    i19minQuantity
  } from '@ecomplus/i18n'
  
  import { i18n } from '@ecomplus/utils'
  
  import ecomCart from '@ecomplus/shopping-cart'
  import ALink from '@ecomplus/storefront-components/src/ALink.vue'
  import AAlert from '@ecomplus/storefront-components/src/AAlert.vue'
  
  export default {
    name: 'QuantitySelector',
  
    components: {
      ALink,
      AAlert
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
      slug: String,
      buyText: String,
      kitProductId: String,
      kitName: String,
      kitPrice: Number,
      canAddToCart: {
        type: Boolean,
        default: true
      },
      hasBuyButton: {
        type: Boolean,
        default: true
      }
    },
  
    data () {
      return {
        selectedQnts: this.items.reduce((selectedQnts, item) => {
          selectedQnts[item._id] = item.quantity || 0
          return selectedQnts
        }, {}),
        hasMinAlert: false,
        hasMaxAlert: false,
        alertVariant: 'warning',
        selectedOption:[],
        selectedProduct:[],
        availableParameters:[],
        readyToBuy : false,
      }
    },
  
    computed: {
      i19maxQuantity: () => i18n(i19maxQuantity),
      i19minQuantity: () => i18n(i19minQuantity),
        
      selectedOptionText(){
        return this.selectedOption
      },
      totalQuantity () {
        let total = 0
        const { selectedQnts } = this
        Object.keys(selectedQnts).forEach(key => {
          if (selectedQnts[key]) {
            total += selectedQnts[key]
          }
        })
        return total
      },
  
      remainingQuantity () {
        return this.max
          ? this.max - this.totalQuantity
          : 9999999
      },
  
      strBuy () {
        //return this.buyText || i18n(i19buyKit)
        return "Adicionar Kit ao Carrinho"
      },
      kitParameters(){
        let me = [...this.selectedProduct];
        let kitParameters = [];
        for(let i in me){                    
            for(let x in me[i].specifications){                
                kitParameters[x] == undefined ? kitParameters[x] = [] : false                
                !kitParameters[x].find(el => el.text == me[i].specifications[x][0].text) ? kitParameters[x].push(me[i].specifications[x][0]) : false
            }
            
        }
        return kitParameters        
      },
      
      kitUniqueItens(){
        let me = [...this.items.filter(el => el.max_quantity >= this.max)];
        let kitUniqueItens = [];
        for(let i in me){
            if(!kitUniqueItens.find(el => el.product_id == me[i].product_id)){                
                kitUniqueItens.push(me[i])
            }        
        }
        return kitUniqueItens
        
      },
      
     
    },
  
    methods: {
        setKitProductOption(items){
            $('.bz_gallery').empty()
            for(let image in items[0].pictures){
                $('<div class="bz_gallery-item"><picture data-iesrc="'+ items[0].pictures[image].big.url +'" class="picture gallery__big-image loaded" ><source srcset="'+ items[0].pictures[image].big.url +'"><img  style=""></picture></div>').appendTo('.bz_gallery')
            }
            $('#apx_kit-options .variations__option').removeClass('variations__option--selected')
            this.selectedProduct = items
            this.selectedOption = []
            this.availableParameters = []
            
        },
        selectedProp(prop, isDenied){
            console.log(isDenied)
            if(isDenied){
              this.selectedOption = []
            }
            let key = Object.keys(prop)[0].trim()

            this.selectedOption[key] = prop[key]
            this.$set(this.selectedOption,0,[...this.selectedOption])

            let me = this.selectedProduct.filter(el => el.specifications[key][0].text === prop[key].text && el.max_quantity >= this.max)
            let kitParameters = [];
            for(let i in me){                    
                for(let x in me[i].specifications){                
                    kitParameters[x] == undefined ? kitParameters[x] = [] : false                
                    !kitParameters[x].find(el => el.text == me[i].specifications[x][0].text) ? kitParameters[x].push(me[i].specifications[x][0]) : false
                }
                
            }

            this.availableParameters = kitParameters
            this.$set(this.availableParameters,0,[...this.availableParameters])
            
            let readyToBuy = false
            let options = []
            //console.log(this.selectedOption)
            //console.log($('.variations__option--selected').length)
            //console.log(Object.keys(this.kitParameters))
            //console.log(Object.keys(this.selectedOption))

            //selectedOptions.shift()
            //console.log(this.selectedOption)
            if(Object.keys(this.selectedOption).length == Object.keys(this.kitParameters).length + 1){
              for(let option in this.selectedOption){
                if(option != 0){
                  let prop = this.selectedOption[option].value
                  let index = option
                  console.log('xxx')
                  console.log(index)
                  console.log(prop)

                  options.push({key: index, value : prop})
                  
                  if(kitParameters[`${index}`].find(el => el.value == prop)){
                    readyToBuy = true
                  }else{
                    readyToBuy = false
                    return false
                  }
                }
              }
              console.log(readyToBuy)
            }

            if(readyToBuy){
              const productToAdd = this.selectedProduct.filter((product) => {
                const { specifications } = product

                let flag = true
                for (let selectedOpt of options){
                  console.log(specifications[selectedOpt.key][0].value == selectedOpt.value)
                  if(specifications[selectedOpt.key][0].value == selectedOpt.value){
                  }else{
                    flag = false
                    return false
                  }
                }                
                return flag
              })
              this.selectedQnts = []
              this.selectedQnts[productToAdd[0]._id] = this.max
              this.$set(this.selectedQnts,0,[...this.selectedQnts])
            }else{
              this.selectedQnts = []
            }
            this.readyToBuy = readyToBuy

           

            
        },

      checkInStock (item) {
        const maxQuantity = item.max_quantity
        return typeof maxQuantity === 'number' && maxQuantity >= 0
          ? maxQuantity
          : 9999999
      },
  
      changeQnt (item, qntDiff, ev) {
        const { selectedQnts, remainingQuantity } = this
        const lastQnt = selectedQnts[item._id]
        let newQnt
        if (qntDiff) {
          newQnt = selectedQnts[item._id] + qntDiff
        } else if (ev) {
          selectedQnts[item._id] = ev.target.value.replace(/\D/g, '')
          newQnt = parseInt(selectedQnts[item._id], 10)
        }
        if (this.items.length === 1 && this.min > newQnt) {
          newQnt = this.min
        }
        if (newQnt > 0) {
          if (item.min_quantity > newQnt) {
            newQnt = item.min_quantity
          } else {
            const itemMaxQnt = item.max_quantity !== undefined ? item.max_quantity : 9999999
            const maxQnt = Math.min(itemMaxQnt, lastQnt + remainingQuantity)
            if (maxQnt < newQnt) {
              this.alertVariant = 'info'
              this.hasMaxAlert = true
              newQnt = maxQnt
            }
          }
          selectedQnts[item._id] = newQnt
        } else {
          selectedQnts[item._id] = 0
        }
        this.$emit('set-quantity', {
          item,
          quantity: selectedQnts[item._id]
        })
      },
  
      buy () {
        this.alertVariant = 'warning'
        if (this.totalQuantity >= this.min) {
          if (this.max === undefined || this.totalQuantity <= this.max) {
            const items = []
            const composition = this.items.map(item => ({
              _id: item.product_id,
              variation_id: item.variation_id,
              quantity: this.selectedQnts[item._id]
            }))
            this.items.forEach(item => {
              const quantity = this.selectedQnts[item._id]
              if (quantity > 0) {
                const newItem = { ...item, quantity }
                delete newItem.customizations
                if (this.kitProductId) {
                  newItem.kit_product = {
                    _id: this.kitProductId,
                    name: this.kitName,
                    pack_quantity: this.totalQuantity,
                    price: this.kitPrice,
                    composition
                  }
                }
                if (this.slug) {
                  newItem.slug = this.slug
                }
                items.push(newItem)
                if (this.canAddToCart) {
                  ecomCart.addItem(newItem)
                }
              }
            })
            this.$emit('buy', { items })
          } else {
            this.hasMaxAlert = true
          }
        } else {
          this.hasMinAlert = true
        }
      }
    },
    mounted(){
        console.log(this.kitUniqueItens)
        console.log(this.kitParameters)
    },
  
    created () {
        
        //console.log(this.kitUniqueItems)
        if (this.max < this.items.length) {
            this.items.forEach(item => this.changeQnt(item))
        }
    }
  }