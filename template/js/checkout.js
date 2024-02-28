import '#template/js/checkout'
import './custom-js/checkout'
import ecomCart from '@ecomplus/shopping-cart'


const paramsURL = new URLSearchParams(window.location.search)
const mcId = paramsURL.get('mc_cid')
const itemsCart = ecomCart.data && ecomCart.data.items
const isBazicash = itemsCart.some(item => item.flags && item.flags.includes('bazicash'))
console.log('id mailchimp', mcId)
console.log('is bazicash?', isBazicash)
if (mcId) {
  const sessionUtm = JSON.parse(window.sessionStorage.getItem('ecomUtm') || '{}') 
  sessionUtm.source = 'mailchimp'
  sessionUtm.term = mcId
  window.sessionStorage.setItem('ecomUtm', JSON.stringify(sessionUtm))
}
if (isBazicash) {
  const sessionUtmBazipass = JSON.parse(window.sessionStorage.getItem('ecomUtm') || '{}') 
  sessionUtmBazipass.content = 'is-bazicash-checkout'
  window.sessionStorage.setItem('ecomUtm', JSON.stringify(sessionUtmBazipass))
}
