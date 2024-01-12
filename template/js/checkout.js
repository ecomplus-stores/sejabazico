import '#template/js/checkout'
import './custom-js/checkout'


const paramsURL = new URLSearchParams(window.location.search)
const mcId = paramsURL.get('mc_cid')
console.log('id mailchimp', mcId)
if (mcId) {
  const sessionUtm = JSON.parse(window.sessionStorage.getItem('ecomUtm') || '{}') 
  sessionUtm.source = 'mailchimp'
  sessionUtm.term = mcId
  window.sessionStorage.setItem('ecomUtm', JSON.stringify(sessionUtm))
}
