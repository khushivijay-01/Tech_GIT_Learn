const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

function displayProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.textContent = "No products found !";
    return;
  }

  const groupedProducts = groupByCategory(products);

  for (const category in groupedProducts) {
    renderCategorySection(category, groupedProducts[category]);
  }
}

function renderCategorySection(category, products) {
  const section = document.createElement("section");
  section.className = "category-section";

  const heading = document.createElement("h2");
  heading.textContent = category;

  heading.style.margin = "20px 0";
  heading.style.color = "#2b79cc";

  const productList = document.createElement("div");
  productList.className = "product-list";

  products.map((product) => {
    const card = createProductCard(product);
    productList.appendChild(card);
  });

  section.appendChild(heading);
  section.appendChild(productList);
  productContainer.appendChild(section);
}

function createProductCard(product) {
  const { id, name, price, category, stock, image } = product;

  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = image;
  img.alt = name;
  img.className = "product-img";

  const info = document.createElement("div");
  info.className = "product-info";

  const productName = document.createElement("h4");
  productName.textContent = name;

  const productPrice = document.createElement("p");
  productPrice.textContent = `₹${price}`;

  const productCategory = document.createElement("span");
  productCategory.textContent = category;

  const stockText = document.createElement("p");
  stockText.className = "stock-text";
  stockText.textContent = stock > 0 ? `In stock: ${stock}` : "Out of stock";

  const action = document.createElement("div");
  action.className = "product-action";

  const quantity = getCartQuantity(id);

  if (quantity === 0) {
    const addBtn = document.createElement("button");
    addBtn.className = "add-to-cart-btn";

    if (stock === 0) {
      addBtn.textContent = "Out of Stock";
      addBtn.disabled = true;
    } else {
      addBtn.textContent = "Add to Cart";
      addBtn.addEventListener("click", () => {
        addToCart(product);
      });
    }

    action.appendChild(addBtn);
  } else {
    const qtyWrapper = document.createElement("div");
    qtyWrapper.className = "qty-wrapper";

    const minusButton = document.createElement("button");
    minusButton.textContent = "−";

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;

    const addButton = document.createElement("button");
    addButton.textContent = "+";

    minusButton.addEventListener("click", () => {
      decreaseQuantity(id);
    });

    addButton.addEventListener("click", () => {
      if (quantity < stock) {
        increaseQuantity(id);
      }
    });

    qtyWrapper.appendChild(minusButton);
    qtyWrapper.appendChild(quantityText);
    qtyWrapper.appendChild(addButton);

    action.appendChild(qtyWrapper);
  }

  info.appendChild(productName);
  info.appendChild(productPrice);
  info.appendChild(productCategory);
  info.appendChild(stockText);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(action);

  return card;
}

function loadCategories(products) {
  const categories = [
    "all",
    ...products
      .map((item) => item.category)
      .filter((category, index, arr) => arr.indexOf(category) === index),
  ];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function applySearchAndFilter() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

searchInput.addEventListener("input", applySearchAndFilter);

if (categoryFilter) {
  categoryFilter.addEventListener("change", applySearchAndFilter);
}

loadCategories(products);
displayProducts(products);
