const openLinksBtn = document.getElementById('links__btn')
const closeLinksBtn = document.getElementById('close-links-btn')
const openCartBtn = document.getElementById('cart__btn')
const cartDom = document.getElementById('cart')
const cartContainerDom = document.querySelector('.cart__container')
const closeCartBtn = document.getElementById('close-cart-btn')
const cartOverlay = document.querySelector('.cart__overlay')
const shopLinksDom = document.querySelector('.shop__links')
const productsDom = document.querySelector('.products__container')
clearBtnDom = document.querySelector('.clear-btn')
const totalAmountDom = document.getElementById('total-amount')
const cartIconTotalDom = document.getElementById('cart-icon-amount')

let productsArray = []
let buttonsArray = []

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
            <button class="add__cart" data-id=${item.id}>Add to Cart</button>
            <div class="product__name">
              <h3>${item.title}</h3>
              <p>$${item.price}</p>
            </div>
          </div>`
  })

  productsDom.innerHTML = result
  buttonsArray = document.querySelectorAll('.add__cart')
  return
}

function getItem(e) {
  let cartItem = {}
  let id = ''
  if (e.target.classList.contains('add__cart')) {
    id = e.target.getAttribute('data-id')
    productsArray.filter((item) => {
      if (item.id === id) {
        cartItem = item
      }
    })
    addItemToCart(cartItem)
    disableButton(id, true, 'In Cart', '#000')
  }

  return cartItem
}

function addItemToCart(item) {
  let result = document.createElement('div')
  result.className = 'cart__item'
  result.id = item.id
  result.innerHTML = `<div class="item__img">
            <img src=${item.image} alt="" />
          </div>
          <div class="item__title">
            <p class="title">${item.title}</p>
            <p>$${item.price}</p>
            <button class="remove" id='remove'>remove</button>
          </div>
          <div class="item__total">
            <button class="total-btn">
              <i class="fas fa-chevron-up" id='increase'></i>
            </button>
            <p class="amount" id="amount">${1}</p>
            <button class="total-btn">
              <i class="fas fa-chevron-down" id='decrease'></i>
            </button>
          </div>`
  cartContainerDom.insertBefore(result, document.querySelector('.total__close'))
  adjustPrice(item.price, true)
  AddToCartIcon(true)
  OpenCart(cartDom)
}

function AddToCartIcon(operation) {
  let total = parseInt(cartIconTotalDom.innerText)
  let newTotal = total
  if (operation) {
    newTotal++
    cartIconTotalDom.innerText = newTotal
  } else {
    newTotal--
    cartIconTotalDom.innerText = newTotal
  }
}

function disableButton(id, disabled, text, color) {
  buttonsArray.forEach((btn) => {
    let btnId = btn.getAttribute('data-id')
    if (btnId === id) {
      btn.disabled = disabled
      btn.innerText = text
      btn.style.backgroundColor = color
    }
  })
}

function adjustPrice(price, operation) {
  let totalPrice = parseFloat(totalAmountDom.innerText)
  if (operation) {
    totalPrice += price
    totalAmountDom.innerText = parseFloat(totalPrice.toFixed(2))
  } else {
    totalPrice -= price
    totalAmountDom.innerText = parseFloat(totalPrice.toFixed(2))
  }
}

function cartFunctionality(e) {
  if (e.target.id === 'increase') {
    let amount = +e.target.parentElement.nextElementSibling.innerText
    amount++
    e.target.parentElement.nextElementSibling.innerText = amount
    let price = +e.target.parentElement.parentElement.previousElementSibling.children[1].innerText.slice(
      1
    )
    adjustPrice(price, true)
    return
  }

  if (e.target.id === 'decrease') {
    let amount = +e.target.parentElement.previousElementSibling.innerText
    amount--
    if (amount <= 0) {
      let itemId = e.target.parentElement.parentElement.parentElement.id
      disableButton(itemId, false, 'Add to Cart', '#002')
      e.target.parentElement.parentElement.parentElement.remove()
      AddToCartIcon(false)
    } else {
      e.target.parentElement.previousElementSibling.innerText = amount
      let price = +e.target.parentElement.parentElement.previousElementSibling.children[1].innerText.slice(
        1
      )
      adjustPrice(price, false)
    }
    return
  }

  if (e.target.id === 'remove') {
    let itemId = e.target.parentElement.parentElement.id
    disableButton(itemId, false, 'Add to Cart', '#002')
    e.target.parentElement.parentElement.remove()
    AddToCartIcon(false)
    return
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

function clearCart() {
  let cartItem = document.querySelectorAll('.cart__item')
  cartItem.forEach((item) => {
    item.remove()
    disableButton(item.id, false, 'Add to Cart', '#002')
    CloseCart(cartDom)
    totalAmountDom.innerText = '0'
    cartIconTotalDom.innerText = '0'
  })
}

document.addEventListener('DOMContentLoaded', fetchProducts)
productsDom.addEventListener('click', (e) => getItem(e))
cartContainerDom.addEventListener('click', (e) => cartFunctionality(e))
openCartBtn.addEventListener('click', () => OpenCart(cartDom))
closeCartBtn.addEventListener('click', () => CloseCart(cartDom))
cartOverlay.addEventListener('click', () => CloseCart(cartDom))
openLinksBtn.addEventListener('click', () => OpenCart(shopLinksDom))
closeLinksBtn.addEventListener('click', () => CloseCart(shopLinksDom))
clearBtnDom.addEventListener('click', clearCart)
