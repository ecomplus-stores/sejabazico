import loadBazicashPrices from './bazicash-prices'

loadBazicashPrices(true)

// Add your custom JavaScript for checkout here.
const getProductData = item => {
  const productData = {
    name: window.ecomUtils && window.ecomUtils.name(item).replace(/\s\/\s.*/, ''),
    id: item.skus[0],
    price: window.ecomUtils && window.ecomUtils.price(item).toFixed(2)
  }
  if (item.quantity) {
    productData.quantity = item.quantity
  }
  return productData
}

const getCartProductsList = (cartSizeBay) => {
  const products = []
  if (cartSizeBay.data && Array.isArray(cartSizeBay.data.items)) {
    cartSizeBay.data.items.forEach(item => {
      products.push(getProductData(item))
    })
  }
  return products
}

const routerCheckout = window.storefrontApp && window.storefrontApp.router
const routeInterval = setInterval(function () {
  if (routerCheckout) {
    const emitCheckout1 = (name, params) => {
      let orderSizeBay
      const orderSizeBayJson = decodeURIComponent(params && params.json)
    if (orderSizeBayJson) {
      try {
        orderSizeBay = JSON.parse(orderSizeBayJson)
      } catch (e) {
      }
    }
    const { amount } = orderSizeBay || window.storefrontApp
    const cartSizeBay = window.cartSizeBay || JSON.parse(window.sessionStorage.getItem('cartsizebay'))
    const actionField = {
      id: routerCheckout.currentRoute && routerCheckout.currentRoute.params && routerCheckout.currentRoute.params.id,
      revenue: (
        (amount && amount.total) ||
        (cartSizeBay.data && cartSizeBay.data.subtotal) ||
        0
      ).toFixed(2)
    }
    if (amount) {
      if (amount.freight !== undefined) {
        actionField.shipping = amount.freight.toFixed(2)
      }
      if (amount.tax !== undefined) {
        actionField.tax = amount.tax.toFixed(2)
      }
    }
    
    if (orderSizeBayJson) {
      if (orderSizeBayJson.extra_discount && orderSizeBayJson.extra_discount.discount_coupon) {
        actionField.coupon = orderSizeBayJson.extra_discount.discount_coupon
      }
    }
    
    window.dataLayer.push({
      event: 'sizebay_purchase',
      ecommerce: {
        currencyCode: 'BRL',
        purchase: {
          actionField,
          products: getCartProductsList(cartSizeBay)
        }
      }
    })
    clearInterval(routeInterval)
    }

    const addRoute1ToData = ({ name, params }) => {
      if (name === 'checkout') {
        window.cartSizeBay = window.ecomCart
        window.sessionStorage.setItem('cartsizebay', JSON.stringify(window.ecomCart))
      } else if (name === 'confirmation') {
        emitCheckout1(name, params)
      }
    }

    if (routerCheckout.currentRoute) {
      addRoute1ToData(routerCheckout.currentRoute)
    }
    routerCheckout.afterEach(addRoute1ToData)
  }
}, 1000)
