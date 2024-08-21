import ecomPassport from '@ecomplus/passport-client'

const checkBazipassInterval = setInterval(() => {
  if (!window.checkedBazipassDoc) return
  document.querySelector('body').classList.add('is-bazipass')
  const customerName = ecomPassport.getCustomerName() || 'Olá'
  const greetingsMsg = `${customerName}, bem vindo ao BaziPass!`
  const $bazipassGreetings = document.querySelectorAll('[data-bazipass-greetings]')
  $bazipassGreetings.forEach(($link) => {
    $link.innerHTML = String.raw`
      ${greetingsMsg}
    `
    $link.href = '/prioridade-bazipass'
  })
  const loyaltyPointsEntries = ecomPassport.customer.loyalty_points_entries
  if (loyaltyPointsEntries && loyaltyPointsEntries.length) {
    const validPoints = loyaltyPointsEntries.reduce((sum, entry) => sum + entry.active_points, 0)
    const $bazipassPoints = document.querySelectorAll('[data-bazipass-points]')
    $bazipassPoints.forEach(($link) => {
      $link.innerHTML = String.raw`
        Você tem ${validPoints} Bazicash
      `
      $link.href = '/pages/produtos-bazicash'
    })
  }
  const $notBazipassUserIcon = document.getElementById('not-bazipass')
  const $bazipassUserIcon = document.getElementById('is-bazipass')
  if (!$bazipassUserIcon.classList.contains('show')) {
    $notBazipassUserIcon.className = 'd-none'
    $bazipassUserIcon.className = 'show'
  }
  const $bazipassWidgetLink = document.getElementsByClassName('widget-open-bazipass-container-home_header-text')[0]
  if ($bazipassWidgetLink) {
    $bazipassWidgetLink.innerHTML = String.raw`
      <a href="/app/#/account/">Verificar saldo</a>
    `
  }
  clearInterval(checkBazipassInterval)
}, 400)
