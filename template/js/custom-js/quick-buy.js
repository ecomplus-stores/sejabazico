const { $ } = window

if (!window.sizeEvent) {
  window.sizeEvent = []
}

window.populateOptions = function (_id, el) {
  $(el || '#content .product-card[data-product-id=' + _id + ']').each(function () {
    const me = $(this)
    const fb = me.find('.apx_fastBuy:not(.loaded)')
    const data = JSON.parse(me.attr('data-product'))
    const grid = data.variationsGrids
    if (grid) {
      fb.append('<div class="apx_fastBuy-title text-uppercase text-bold">Compra Rápida</div>')
      $.each(grid, function (k, item) {
        const block = $('<div key="' + k + '" class="apx_fastBuy-options"></div>')
        $.each(item, function (k2, opt) {
          block.append('<button type="button" option="' + opt + '">' + opt + '</button>')
        })
        fb.append(block)
      })
    }
    fb.addClass('loaded')
  })
}

$('body').on('click', '.apx_fastBuy button', function () {
  const product = JSON.parse($(this).closest('[data-product-full]').attr('data-product-full'))
  product.product_id = product._id
  $(this).closest('div').find('button').removeClass('active')
  $(this).addClass('active')
  const fb = $(this).closest('.apx_fastBuy')
  $(this).closest('[key]').attr('option', $(this).attr('option'))

  if (fb.find('[key]').length === 1) {
    if ($(this).closest('[key]').is(':last-child')) {
      const addToCart = fb.find('.apx_fastBuy-options[option]').length === fb.find('[key]').length
      if (addToCart) {
        const options = fb.find('.apx_fastBuy-options[option]').map(function (i) {
          return {
            key: $(this).attr('key'),
            value: $(this).attr('option')
          }
        })

        const grid = JSON.parse($(this).closest('.apx_fastBuy').attr('grid'))
        let q
        if (options.length === 1) {
          q = grid.find(el => el.specifications[options[0].key][0].text === options[0].value)
        }
        if (options.length === 2) {
          q = grid.find(el => {
            return el.specifications[options[0].key][0].text === options[0].value &&
              el.specifications[options[1].key][0].text === options[1].value
          })
        }

        if (q && q.quantity) {
          window.sizeEvent.push(product)
          window.ecomCart.addProduct(product, q._id, 1, true)
        } else {
          const text = $(this).text()
          $(this).text('Sem estoque').prop('disabled', true).css('opacity', 0.85).css('font-weight', 400)
          setTimeout(() => {
            $(this).text(text)
            $(document).one('click', () => {
              $(this).text(text).prop('disabled', false).css('opacity', '').css('font-weight', '')
            })
          }, 2000)
        }
      }
    }
  }

  if (fb.find('[key]').length === 2) {
    if ($(this).closest('[key]').is(':last-child')) {
      const addToCart = fb.find('.apx_fastBuy-options[option]').length === fb.find('[key]').length
      if (addToCart) {
        const options = fb.find('.apx_fastBuy-options[option]').map(function (i) {
          return {
            key: $(this).attr('key'),
            value: $(this).attr('option')
          }
        })

        const grid = JSON.parse($(this).closest('.apx_fastBuy').attr('grid'))
        let q
        if (options.length === 1) {
          q = grid.find(el => el.specifications[options[0].key][0].text === options[0].value)
        }
        if (options.length === 2) {
          q = grid.find(el => {
            return el.specifications[options[0].key][0].text === options[0].value &&
              el.specifications[options[1].key][0].text === options[1].value
          })
        }

        if (q && q.quantity) {
          window.sizeEvent.push(product)
          window.ecomCart.addProduct(product, q._id, 1, true)
        } else {
          const text = $(this).text()
          $(this).text('Sem estoque').prop('disabled', true).css('opacity', 0.85).css('font-weight', 400)
          setTimeout(() => {
            $(this).text(text)
            $(document).one('click', () => {
              $(this).text(text).prop('disabled', false).css('opacity', '').css('font-weight', '')
            })
          }, 2000)
        }
      }
    } else {
      $(this).closest('.apx_fastBuy').find('[key]').removeAttr('option')
      $(this).closest('[key]').attr('option', $(this).attr('option'))
      fb.find('[key]:last-child button').removeClass('active')
      const grid = JSON.parse($(this).closest('.apx_fastBuy').attr('grid'))
      const key = $(this).closest('[key]').attr('key')
      const currentOpt = $(this).attr('option')

      fb.find('button').addClass('disabled')
      const q = grid.filter(el => el.specifications[key][0].text === currentOpt)
      $.each(q, function (i, item) {
        $.each(item.specifications, function (i_, item_) {
          if (fb.find('[key="' + i_ + '"]').length > 0) {
            fb.find('[key="' + i_ + '"] button[option="' + item_[0].text + '"]').removeClass('disabled').addClass('available')
          }
        })
      })
    }
  }
})
