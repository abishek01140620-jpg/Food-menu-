const menuItems = [
  {
    id: 1,
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with Indian spices",
    price: 220,
    category: "starters",
    image: "https://images.unsplash.com/photo-1567188077794-750232b3ac2e?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    name: "Veg Spring Rolls",
    description: "Crispy rolls filled with vegetables",
    price: 160,
    category: "starters",
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry",
    price: 340,
    category: "main-course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 4,
    name: "Veg Biryani",
    description: "Fragrant rice with vegetables and spices",
    price: 250,
    category: "main-course",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab5a4a4?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 5,
    name: "Gulab Jamun",
    description: "Soft milk dumplings in sugar syrup",
    price: 120,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571167530149-c72f2b6b7b6c?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 6,
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with nuts",
    price: 180,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e17023?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 7,
    name: "Masala Chai",
    description: "Traditional Indian spiced tea",
    price: 60,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 8,
    name: "Fresh Lime Soda",
    description: "Refreshing lemon soda with mint",
    price: 90,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=60"
  }
];

let cart = [];
let activeCategory = "all";

const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const cartPanel = document.getElementById("cartPanel");
const orderMessage = document.getElementById("orderMessage");

function formatINR(amount) {
  return `₹${amount.toFixed(2)}`;
}

function renderMenu() {
  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter(item => item.category === activeCategory);

  menuGrid.innerHTML = filteredItems
    .map(
      item => `
      <article class="food-card">
        <img src="${item.image}" alt="${item.name}" />
        <div class="food-details">
          <h3 class="food-name">${item.name}</h3>
          <p class="food-description">${item.description}</p>
          <p class="food-price">${formatINR(item.price)}</p>
          <button class="add-button" data-id="${item.id}">
            Add to Cart
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
  } else {
    cartItems.innerHTML = cart
      .map(
        item => `
        <div class="cart-item">
          <div>
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">
              ${formatINR(item.price)} × ${item.quantity}
            </p>
          </div>

          <div class="quantity-controls">
            <button data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  updateBill();
}

function updateBill() {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  subtotalElement.textContent = formatINR(subtotal);
  taxElement.textContent = formatINR(tax);
  totalElement.textContent = formatINR(total);
}

function addToCart(itemId) {
  const selectedItem = menuItems.find(item => item.id === itemId);
  const existingItem = cart.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1
    });
  }

  renderCart();
}

function changeQuantity(itemId, action) {
  const cartItem = cart.find(item => item.id === itemId);

  if (!cartItem) return;

  if (action === "increase") {
    cartItem.quantity += 1;
  }

  if (action === "decrease") {
    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
      cart = cart.filter(item => item.id !== itemId);
    }
  }

  renderCart();
}

document.addEventListener("click", event => {
  const addButton = event.target.closest(".add-button");

  if (addButton) {
    addToCart(Number(addButton.dataset.id));
    return;
  }

  const quantityButton = event.target.closest(".quantity-controls button");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.id),
      quantityButton.dataset.action
    );
    return;
  }

  const filterButton = event.target.closest(".filter-btn");

  if (filterButton) {
    document
      .querySelectorAll(".filter-btn")
      .forEach(button => button.classList.remove("active"));

    filterButton.classList.add("active");
    activeCategory = filterButton.dataset.category;
    renderMenu();
  }
});

document.getElementById("cartButton").addEventListener("click", () => {
  cartPanel.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add items to your cart first.");
    return;
  }

  orderMessage.classList.remove("hidden");
});

document.getElementById("closeMessage").addEventListener("click", () => {
  orderMessage.classList.add("hidden");
  cart = [];
  renderCart();
  cartPanel.classList.remove("open");
});

renderMenu();
renderCart();
