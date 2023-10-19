import ecomCart from '@ecomplus/shopping-cart'

export default (isCheckout = false) => {
  window.isBazicashPage = /^\/pages\/.*bazicash.*/.test(window.location.pathname)
  if (isCheckout || window.isBazicashPage) {
    const fetch = () => {
      window.axios.get('https://us-central1-app-bazicash.cloudfunctions.net/app/product-points')
        .then(({ data }) => {
          window.bazicashPrices = data
          window.dispatchEvent(new Event('bazicashPrices'))
        })
        .catch(console.error)
    }
    if (typeof window.requestIdleCallback === 'function') {
      setTimeout(fetch, window.requestIdleCallback(fetch), 300)
    } else {
      setTimeout(fetch, 600)
    }
  }
  if (window.isBazicashPage) {
    ecomCart.on('addItem', ({ item }) => {
      if (!item.flags) item.flags = []
      item.flags.push('bazicash')
    })
  }
}
