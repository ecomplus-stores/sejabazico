import ecomCart from '@ecomplus/shopping-cart'
import ecomPassport from '@ecomplus/passport-client'
import { debounce } from 'perfect-debounce'

export default (isCheckout = false) => {
  window.isBazicashPage = /^\/pages\/.*bazicash.*/.test(window.location.pathname) ||
    window.location.search.includes('?bazicash')
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
      setTimeout(() => window.requestIdleCallback(fetch), 300)
    } else {
      setTimeout(fetch, 600)
    }
  }
  if (window.isBazicashPage && !isCheckout) {
    ecomCart.on('addItem', ({ item }) => {
      if (!item.flags) item.flags = []
      item.flags.push('bazicash')
    })
  }
  const checkBazipass = debounce(() => {
    const customerDoc = ecomPassport.getCustomer().doc_number
    if (customerDoc && customerDoc !== window.checkedBazipassDoc) {
      window.axios.get(
        'https://us-central1-app-bazicash.cloudfunctions.net/app/check-bazipass' +
        `?doc=${customerDoc}`
      )
        .then(({ data }) => {
          if (data.hasBazipass) {
            window.checkedBazipassDoc = customerDoc
            window.sessionStorage.setItem('isBazipass', 1)
            window.dispatchEvent(new Event('bazipassCheck'))
          }
        })
        .catch(console.error)
    }
  }, 400)
  ecomPassport.on('change', checkBazipass)
  if (ecomPassport.checkLogin()) {
    checkBazipass()
  }
}
