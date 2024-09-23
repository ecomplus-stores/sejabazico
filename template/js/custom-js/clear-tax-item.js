import ecomCart from '@ecomplus/shopping-cart'

if (ecomCart.data.items) {
  ecomCart.data.items.forEach((item) => {
    if (item.product_id === window.TAX_ITEM_ID) {
      ecomCart.removeItem(item._id)
    }
  })
}
