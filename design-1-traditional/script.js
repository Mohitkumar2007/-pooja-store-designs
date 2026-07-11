// ============================================
// Shree Pooja Bhandar — Cart Engine (in-memory, vanilla JS)
// ============================================

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // placeholder — replace with real shop number

const products = [
  { id: 1,  name: "Brass Diya — Small",              cat: "Diyas",    emoji: "🪔", price: 149,  bg: "linear-gradient(150deg,#F4CB86,#E67635)" },
  { id: 2,  name: "Sandalwood Agarbatti (20 sticks)", cat: "Incense",  emoji: "🕯️", price: 89,   bg: "linear-gradient(150deg,#E9D8B8,#C9A227)" },
  { id: 3,  name: "Steel Pooja Thali Set",            cat: "Thali",    emoji: "🍽️", price: 499,  bg: "linear-gradient(150deg,#F0E2C4,#8B6B3D)" },
  { id: 4,  name: "Fresh Coconut (Pair)",             cat: "Coconuts", emoji: "🥥", price: 60,   bg: "linear-gradient(150deg,#F6E7C9,#B98A4B)" },
  { id: 5,  name: "Pure Camphor (50g)",                cat: "Camphor",  emoji: "✨", price: 40,   bg: "linear-gradient(150deg,#FFF3D6,#E4C766)" },
  { id: 6,  name: "Kumkum & Haldi Combo",              cat: "Kumkum",   emoji: "🌼", price: 75,   bg: "linear-gradient(150deg,#F7C873,#E67635)" },
  { id: 7,  name: "Brass Ganesh Idol",                 cat: "Idols",    emoji: "🕉️", price: 899,  bg: "linear-gradient(150deg,#E4C766,#8B6B3D)" },
  { id: 8,  name: "Marigold Flower Garland",           cat: "Garlands", emoji: "🌺", price: 120,  bg: "linear-gradient(150deg,#F6A65C,#E63946)" },
  { id: 9,  name: "Cotton Wicks — Batti Pack",         cat: "Wicks",    emoji: "🧵", price: 35,   bg: "linear-gradient(150deg,#F3E6D0,#C9A227)" },
  { id: 10, name: "Havan Samagri Kit",                  cat: "Havan",    emoji: "🔥", price: 249,  bg: "linear-gradient(150deg,#F0A868,#6B1E23)" },
];

let cart = {}; // { productId: qty }
let drawerOpen = false;

const grid = document.getElementById("productGrid");
const cartBar = document.getElementById("cartBar");
const cartDrawer = document.getElementById("cartDrawer");
const cartCountEl = document.getElementById("cartCount");
const cartItemsLabel = document.getElementById("cartItemsLabel");
const cartTotalLabel = document.getElementById("cartTotalLabel");
const drawerItems = document.getElementById("drawerItems");
const drawerTotal = document.getElementById("drawerTotal");

function formatPrice(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function getCartCount() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((pr) => pr.id === Number(id));
    return sum + p.price * qty;
  }, 0);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  onCartChange();
}

function incrementItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  onCartChange();
}

function decrementItem(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  onCartChange();
}

function removeItem(id) {
  delete cart[id];
  onCartChange();
}

function onCartChange() {
  renderGrid();
  renderCartBar();
  renderDrawer();
  pulseCartBar();
}

// ---------- Product grid ----------
function renderGrid() {
  grid.innerHTML = products
    .map((p) => {
      const qty = cart[p.id] || 0;
      return `
      <div class="product-card">
        <div class="product-media" style="background:${p.bg}">
          <span>${p.emoji}</span>
          <div class="arch"></div>
        </div>
        <div class="product-body">
          <span class="product-cat">${p.cat}</span>
          <span class="product-name">${p.name}</span>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}<br><small>per item</small></span>
            ${
              qty === 0
                ? `<button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name}">+</button>`
                : `<div class="stepper">
                    <button data-dec="${p.id}" aria-label="Decrease">−</button>
                    <span class="qty">${qty}</span>
                    <button data-inc="${p.id}" aria-label="Increase">+</button>
                  </div>`
            }
          </div>
        </div>
      </div>`;
    })
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)))
  );
  grid.querySelectorAll("[data-inc]").forEach((btn) =>
    btn.addEventListener("click", () => incrementItem(Number(btn.dataset.inc)))
  );
  grid.querySelectorAll("[data-dec]").forEach((btn) =>
    btn.addEventListener("click", () => decrementItem(Number(btn.dataset.dec)))
  );
}

// ---------- Cart bar ----------
function renderCartBar() {
  const count = getCartCount();
  const total = getCartTotal();

  if (count === 0) {
    cartBar.classList.add("hidden");
    cartDrawer.classList.add("hidden");
    drawerOpen = false;
    return;
  }

  cartBar.classList.remove("hidden");
  cartCountEl.textContent = count;
  cartItemsLabel.textContent = `${count} item${count > 1 ? "s" : ""}`;
  cartTotalLabel.textContent = formatPrice(total);
}

function pulseCartBar() {
  cartBar.classList.remove("bounce");
  cartCountEl.classList.remove("bump");
  void cartBar.offsetWidth; // reflow to restart animation
  cartBar.classList.add("bounce");
  cartCountEl.classList.add("bump");
}

// ---------- Drawer ----------
function renderDrawer() {
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    drawerItems.innerHTML = `<div class="drawer-empty">Your basket is empty</div>`;
    drawerTotal.textContent = formatPrice(0);
    return;
  }

  drawerItems.innerHTML = entries
    .map(([id, qty]) => {
      const p = products.find((pr) => pr.id === Number(id));
      return `
      <div class="drawer-item">
        <span class="drawer-item-emoji">${p.emoji}</span>
        <div class="drawer-item-info">
          <div class="name">${p.name}</div>
          <div class="line-price">${formatPrice(p.price)} × ${qty} = ${formatPrice(p.price * qty)}</div>
        </div>
        <div class="stepper">
          <button data-dec="${p.id}" aria-label="Decrease">−</button>
          <span class="qty">${qty}</span>
          <button data-inc="${p.id}" aria-label="Increase">+</button>
        </div>
      </div>`;
    })
    .join("");

  drawerItems.querySelectorAll("[data-inc]").forEach((btn) =>
    btn.addEventListener("click", () => incrementItem(Number(btn.dataset.inc)))
  );
  drawerItems.querySelectorAll("[data-dec]").forEach((btn) =>
    btn.addEventListener("click", () => decrementItem(Number(btn.dataset.dec)))
  );

  drawerTotal.textContent = formatPrice(getCartTotal());
}

function toggleDrawer() {
  if (getCartCount() === 0) return;
  drawerOpen = !drawerOpen;
  cartDrawer.classList.toggle("hidden", !drawerOpen);
}

// ---------- WhatsApp checkout ----------
function buildWhatsAppMessage() {
  const lines = Object.entries(cart).map(([id, qty]) => {
    const p = products.find((pr) => pr.id === Number(id));
    return `${p.emoji} ${p.name} × ${qty} — ${formatPrice(p.price * qty)}`;
  });

  return (
    `Namaste! I'd like to order the following from Shree Pooja Bhandar:\n\n` +
    lines.join("\n") +
    `\n\nTotal: ${formatPrice(getCartTotal())}\n\nPlease confirm availability. Thank you!`
  );
}

function openWhatsAppOrder() {
  if (getCartCount() === 0) return;
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// ---------- Wire up static elements ----------
cartBar.addEventListener("click", toggleDrawer);
document.getElementById("closeDrawer").addEventListener("click", (e) => {
  e.stopPropagation();
  drawerOpen = false;
  cartDrawer.classList.add("hidden");
});
document.getElementById("whatsappBtn").addEventListener("click", openWhatsAppOrder);

// ---------- Init ----------
renderGrid();
renderCartBar();
renderDrawer();
