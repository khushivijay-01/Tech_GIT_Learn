"use strict";

import { getCart, saveCart, calculateTotal } from "./cart.js";

const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");

let cart = getCart();

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      
      <div class="cart-details">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>

        <div class="qty-controls">
          <button class="minus">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="plus">+</button>
        </div>
      </div>

      <div class="item-total">
        ₹${item.price * item.quantity}
      </div>
    `;

    const plusBtn = div.querySelector(".plus");
    const minusBtn = div.querySelector(".minus");
    const qtySpan = div.querySelector(".qty");

    plusBtn.addEventListener("click", () => {
      item.quantity++;
      qtySpan.textContent = item.quantity;
      updateCart();
    });

    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = `Total: ₹${calculateTotal(cart)}`;
}

function updateCart() {
  saveCart(cart);
  renderCart();
}

renderCart();
