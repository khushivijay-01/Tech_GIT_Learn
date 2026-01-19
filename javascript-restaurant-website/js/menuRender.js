"use strict";

import { products } from "./data/products.js";

const menuContainer = document.getElementById("menu-container");
const productCardMap = {};

function groupByCategory(items) {
  return items.reduce((result, item) => {
    if (!result[item.category]) {
      result[item.category] = [];
    }
    result[item.category].push(item);
    return result;
  }, {});
}

const groupedProducts = groupByCategory(products);

function createCategorySection(categoryName, items) {
  const section = document.createElement("section");
  section.className = "category-section";

  section.dataset.category = categoryName;

  section.innerHTML = `
    <h2 class="category-title">${categoryName}</h2>

    <div class="carousel-wrapper">
      <button class="nav-btn left">&#10094;</button>

      <div class="carousel-container">
        <div class="carousel-track"></div>
      </div>

      <button class="nav-btn right">&#10095;</button>
    </div>
  `;

  const track = section.querySelector(".carousel-track");

  items.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.dataset.name = product.name.toLowerCase();

    card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="content">
      <h4>${product.name}</h4>
      <p>Stock: ${product.stock}</p>
      <div class="price">₹${product.price}</div>
      <div class="qty-controls">
      <button class="qty-btn minus">−</button>
      <span class="qty">0</span>
      <button class="qty-btn plus">+</button>
    </div>
    </div>
  `;

    track.appendChild(card);

    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");
    const qtySpan = card.querySelector(".qty");

    let quantity = 0;

    plusBtn.addEventListener("click", () => {
      if (quantity < product.stock) {
        quantity++;
        qtySpan.textContent = quantity;
        addToCart(product, quantity);
      }
    });

    minusBtn.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        qtySpan.textContent = quantity;
        addToCart(product, quantity);
      }
    });

    // 🔥 IMPORTANT MAP
    productCardMap[product.name.toLowerCase()] = {
      section,
      track,
      index,
    };
  });

  setupCarousel(section, items.length);
  menuContainer.appendChild(section);
}

function setupCarousel(section, totalCards) {
  const track = section.querySelector(".carousel-track");
  const nextBtn = section.querySelector(".nav-btn.right");
  const prevBtn = section.querySelector(".nav-btn.left");

  let currentIndex = 0;
  const cardWidth = 280;
  const visibleCards = 3;

  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalCards - visibleCards) {
      currentIndex++;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });
}

Object.keys(groupedProducts).forEach((category) => {
  createCategorySection(category, groupedProducts[category]);
});

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  if (!value) return;

  for (let key in productCardMap) {
    if (key.includes(value)) {
      scrollToProduct(key);
      break;
    }
  }
});

function scrollToProduct(productName) {
  const data = productCardMap[productName];
  if (!data) return;

  const { section, track, index } = data;

  // 1️⃣ scroll to category section
  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  // 2️⃣ slide carousel to product
  const cardWidth = 280;
  track.style.transform = `translateX(-${index * cardWidth}px)`;

  // 3️⃣ highlight card
  const cards = track.children;
  [...cards].forEach((card) => card.classList.remove("active-card"));

  cards[index].classList.add("active-card");
}

const categoryFilter = document.getElementById("category-filter");

if (categoryFilter) {
  categoryFilter.addEventListener("change", function () {
    const selectedCategory = this.value;

    // All select ho to top par le jao
    if (selectedCategory === "all") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const targetSection = document.querySelector(
      `.category-section[data-category="${selectedCategory}"]`,
    );

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}


function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function addToCart(product, quantity) {
  let cart = getCart();

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity = quantity;
    if (existingItem.quantity === 0) {
      cart = cart.filter(item => item.id !== product.id);
    }
  } else if (quantity > 0) {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = totalQty;
  }
}

updateCartCount();
