const openLinksBtn = document.getElementById('links__btn')
const closeLinksBtn = document.getElementById('close-links-btn')
const openCartBtn = document.getElementById('cart__btn')
const cartDom = document.getElementById('cart')
const closeCartBtn = document.getElementById('close-cart-btn')
const cartOverlay = document.querySelector('.cart__overlay')
const shopLinksDom = document.querySelector('.shop__links')
const productsDom = document.querySelector('.products__container')

let productsArray = []

async function fetchProducts() {
  try {
    const res = await fetch('products.json')
    let data = await res.json()
    let products = data.items

    products = products.map((item) => {
      const { title, price } = item.fields
      const { id } = item.sys
      const image = item.fields.image.fields.file.url

      return { title, price, id, image }
    })

    displayProducts(products)
    productsArray = products
    return products
  } catch (err) {
    console.log(err)
  }
}

function displayProducts(proArray) {
  let result = ''
  proArray.map((item) => {
    result += `<div class="product">
            <div class="product__img">
              <img src=${item.image} alt="" />
            </div>
            <button class="add__cart" data-id=${item.id}'>Add to Cart</button>
            <div class="product__name">
              <h3>${item.title}</h3>
              <p>$${item.price}</p>
            </div>
          </div>`
  })
  productsDom.innerHTML = result
  return
}
// ---------------------------------------HERE-----------------
function getItem(e) {
  let addButton = e.target
  if (addButton.classList.contains('add__cart')) {
    let dataId = addButton.getAttribute('data-id')
    let id = parseInt(dataId)
    console.log(id)
  }
}

function OpenCart(domEl) {
  if (!domEl.classList.contains('show')) {
    domEl.classList.add('show')
  }
  return
}

function CloseCart(domEl) {
  if (domEl.classList.contains('show')) {
    domEl.classList.remove('show')
  }
  return
}

document.addEventListener('DOMContentLoaded', fetchProducts)
productsDom.addEventListener('click', (e) => getItem(e))
openCartBtn.addEventListener('click', () => OpenCart(cartDom))
closeCartBtn.addEventListener('click', () => CloseCart(cartDom))
cartOverlay.addEventListener('click', () => CloseCart(cartDom))
openLinksBtn.addEventListener('click', () => OpenCart(shopLinksDom))
closeLinksBtn.addEventListener('click', () => CloseCart(shopLinksDom))
