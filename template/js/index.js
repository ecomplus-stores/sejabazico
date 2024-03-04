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
console.log('is bazicash:', isBazicash)
