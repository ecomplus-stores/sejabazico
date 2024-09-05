import ecomCart from '@ecomplus/shopping-cart'
import ecomPassport from '@ecomplus/passport-client'
import { debounce } from 'perfect-debounce'

export default (isCheckout = false) => {
  window.isBazicashPage = /^\/pages\/.*bazicash.*/.test(window.location.pathname) ||
    window.location.search.includes('?bazicash')
  window.bazicashRatio = 0.1
  if (window.isBazicashPage && !isCheckout) {
    ecomCart.on('addItem', ({ item }) => {
      if (!item.flags) item.flags = []
      item.flags.push('bazicash')
    })
  }
  const checkBazipass = debounce(() => {
    const customerDoc = ecomPassport.getCustomer().doc_number
    /* window.checkedBazipassDoc = customerDoc
    window.sessionStorage.setItem('isBazipass', 1) */
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
