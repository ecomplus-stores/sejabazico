import '#template/js/'
import './custom-js/pages'


const paramsURL = new URLSearchParams(window.location.search)
const mcId = paramsURL.get('mc_cid')
console.log('id mailchimp', mcId)
if (mcId) {
  const sessionUtm = JSON.parse(window.sessionStorage.getItem('ecomUtm') || '{}') 
  sessionUtm.source = 'mailchimp'
  sessionUtm.term = mcId
  window.sessionStorage.setItem('ecomUtm', JSON.stringify(sessionUtm))
}

const itemsCart = window.ecomCart.data && window.ecomCart.data.items
const isBazicash = itemsCart.some(item => item.flags && item.flags.includes('bazicash'))
if (isBazicash) {
    const sessionUtmBazipass = JSON.parse(window.sessionStorage.getItem('ecomUtm') || '{}') 
    sessionUtmBazipass.content = 'is-bazicash-checkout'
    window.sessionStorage.setItem('ecomUtm', JSON.stringify(sessionUtmBazipass))
}
