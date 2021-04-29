const productsDom = document.querySelector('.products__container')
const openLinksBtn = document.getElementById('links__btn')
const closeLinksBtn = document.getElementById('close-links-btn')
const openCartBtn = document.getElementById('cart__btn')
const cartDom = document.getElementById('cart')
const closeCartBtn = document.getElementById('close-cart-btn')
const cartOverlay = document.querySelector('.cart__overlay')
const shopLinksDom = document.querySelector('.shop__links')
const cartContainerDom = document.querySelector('.cart__container')
const totalAmountDom = document.getElementById('total-amount')
const cartIconTotalDom = document.getElementById('cart-icon-amount')

let buttonsArray = []

class Products {
  async getProducts() {
    const res = await fetch('products.json')
    let data = await res.json()
    let products = data.items

    products = products.map((item) => {
      let { title, price } = item.fields
      let { id } = item.sys
      let image = item.fields.image.fields.file.url

      return { title, price, id, image }
    })
    return products
  }
}

class Ui {
  displayProducts(products) {
    let result = ''

    products.forEach((item) => {
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
    this.getItem(products)
  }

  getItem(products) {
    let cartItem = {}
    productsDom.addEventListener('click', (e) => {
      if (e.target.classList.contains('add__cart')) {
        let id = e.target.getAttribute('data-id')
        products.forEach((item) => {
          if (item.id === id) {
            cartItem = item
          }
        })
        this.addItemToCart(cartItem)
        this.disableButton(id, true, 'In Cart', '#000')
      }
      return
    })
  }

  addItemToCart(item) {
    let cartItem = document.createElement('div')
    cartItem.className = 'cart__item'
    cartItem.id = item.id

    cartItem.innerHTML = `<div class="item__img">
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

    cartContainerDom.insertBefore(
      cartItem,
      document.querySelector('.total__close')
    )
    this.adjustTotalPrice(item.price, true)
    this.totalCartIcon(true)
    cartDom.classList.add('show')
    return
  }

  disableButton(id, disable, text, color) {
    buttonsArray.forEach((btn) => {
      let btnId = btn.getAttribute('data-id')
      if (btnId === id) {
        btn.disabled = disable
        btn.innerText = text
        btn.style.backgroundColor = color
      }
    })
  }

  cartFunctionality(e) {
    if (e.target.id === 'increase') {
      let amount = +e.target.parentElement.nextElementSibling.innerText
      amount++
      e.target.parentElement.nextElementSibling.innerText = amount
      let price = +e.target.parentElement.parentElement.previousElementSibling.children[1].innerText.slice(
        1
      )
      this.adjustTotalPrice(price, true)
      return
    }

    if (e.target.id === 'decrease') {
      let amount = +e.target.parentElement.previousElementSibling.innerText
      amount--
      let price = +e.target.parentElement.parentElement.previousElementSibling.children[1].innerText.slice(
        1
      )
      this.adjustTotalPrice(price, false)
      if (amount <= 0) {
        let itemId = e.target.parentElement.parentElement.parentElement.id
        this.disableButton(itemId, false, 'Add to Cart', '#002')
        e.target.parentElement.parentElement.parentElement.remove()
        this.totalCartIcon(false)
      } else {
        e.target.parentElement.previousElementSibling.innerText = amount
      }
      return
    }

    if (e.target.id === 'remove') {
      let itemId = e.target.parentElement.parentElement.id
      this.disableButton(itemId, false, 'Add to Cart', '#002')
      e.target.parentElement.parentElement.remove()
      this.totalCartIcon(false)
      return
    }

    if (e.target.classList.contains('clear-btn')) {
      let cartItem = document.querySelectorAll('.cart__item')
      cartItem.forEach((item) => {
        item.remove()
        this.disableButton(item.id, false, 'Add to Cart', '#002')
        totalAmountDom.innerText = '0'
        cartIconTotalDom.innerText = '0'
        cartDom.className = 'cart'
      })
    }
  }

  adjustTotalPrice(price, operation) {
    let totalPrice = parseFloat(totalAmountDom.innerText)
    if (operation) {
      totalPrice += price
      totalAmountDom.innerText = parseFloat(totalPrice.toFixed(2))
    } else {
      totalPrice -= price
      totalAmountDom.innerText = parseFloat(totalPrice.toFixed(2))
    }
  }

  totalCartIcon(operation) {
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

  static handleOpenCloseCart(btn, domEl, operation) {
    if (operation) {
      btn.addEventListener('click', () => domEl.classList.add('show'))
    } else {
      btn.addEventListener('click', () => domEl.classList.remove('show'))
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const products = new Products()
  const ui = new Ui()

  products.getProducts().then((product) => {
    ui.displayProducts(product)
  })
})

cartContainerDom.addEventListener('click', (e) => {
  const uiFunctions = new Ui()
  uiFunctions.cartFunctionality(e)
})

Ui.handleOpenCloseCart(openCartBtn, cartDom, true)
Ui.handleOpenCloseCart(openLinksBtn, shopLinksDom, true)
Ui.handleOpenCloseCart(closeCartBtn, cartDom, false)
Ui.handleOpenCloseCart(cartOverlay, cartDom, false)
Ui.handleOpenCloseCart(closeLinksBtn, shopLinksDom, false)
