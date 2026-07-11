/* ============================================================
   Pooja Store — shared cart engine (vanilla JS, in-memory)
   Same logic across all 3 design directions.
   Zepto-style: + stepper on card · live cart bar · WhatsApp checkout
   ============================================================ */

// --- Config (edit these for the real shop) ---
const SHOP_NUMBER = '91XXXXXXXXXX';                 // wa.me number placeholder
const SHOP_NAME = document.body.dataset.shop || 'The Pooja Store';
const CARD_STYLE = document.body.dataset.cardstyle || 'overlay'; // overlay | catalog
const SERVICEABLE = ['560087', '560066', '560037']; // PIN codes we deliver to (demo)

// --- Catalogue (English names, placeholder prices) ---
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const PRODUCTS = [
  { id: 'lamp',     name: 'Brass Oil Lamp',       cat: 'Lamps',        price: 249,  unit: 'each',        emoji: '🪔', img: IMG('photo-1574161099616-d867c26bd96f'), grad: 'linear-gradient(145deg,#8a4b1e,#c9772f)' },
  { id: 'incense',  name: 'Rose Incense Sticks',  cat: 'Incense',      price: 99,   unit: 'pack of 20',  emoji: '🌿', img: IMG('photo-1587389342341-0f54e01f6472'), grad: 'linear-gradient(145deg,#7a3b52,#b8657f)' },
  { id: 'sandal',   name: 'Sandalwood Incense',   cat: 'Incense',      price: 149,  unit: 'premium box', emoji: '🪵', img: IMG('photo-1615568581020-e25f187a02c8'), grad: 'linear-gradient(145deg,#6b4a2a,#a07b45)' },
  { id: 'thali',    name: 'Brass Prayer Plate',   cat: 'Brassware',    price: 899,  unit: 'full set',    emoji: '✨', img: IMG('photo-1578662996442-48f60103fc96'), grad: 'linear-gradient(145deg,#9a7318,#d4a72c)' },
  { id: 'turmeric', name: 'Pure Turmeric Powder', cat: 'Essentials',   price: 79,   unit: '100 g',       emoji: '🟡', img: IMG('photo-1615485500704-8e99099d9d09'), grad: 'linear-gradient(145deg,#b8860b,#e0b021)' },
  { id: 'pot',      name: 'Copper Kalash Pot',    cat: 'Brassware',    price: 649,  unit: 'each',        emoji: '🫖', img: IMG('photo-1605646199346-6014e7a83d2e'), grad: 'linear-gradient(145deg,#8a4b2a,#bd7a44)' },
  { id: 'garland',  name: 'Fresh Jasmine Garland',cat: 'Fresh Flowers',price: 149,  unit: 'per string',  emoji: '🌸', img: IMG('photo-1629196914168-4f2c8f9d91e5'), grad: 'linear-gradient(145deg,#9c5a3c,#caa06a)' },
  { id: 'hamper',   name: 'Festive Gift Box',     cat: 'Gifting',      price: 1299, unit: 'curated',     emoji: '🎁', img: IMG('photo-1513475382585-d06e58bcb0e0'), grad: 'linear-gradient(145deg,#7a3b2e,#c26a4a)' },
];

// Bento tile sizing — feature(0) is the big hero tile, wide(5) a banner, tall(3) a column
function sizeClass(i) {
  if (i === 0) return 'tile--feature';
  if (i === 3) return 'tile--tall';
  if (i === 5) return 'tile--wide';
  return '';
}

const fmt = n => '₹' + n.toLocaleString('en-IN');
const state = {};                       // id -> qty
const byId = id => PRODUCTS.find(p => p.id === id);

// --- Element refs ---
const grid       = document.getElementById('productGrid');
const cartBar    = document.getElementById('cartBar');
const cartCount  = document.getElementById('cartCount');
const cartQty    = document.getElementById('cartQty');
const cartTotal  = document.getElementById('cartTotal');
const drawer     = document.getElementById('cartDrawer');
const drawerItems= document.getElementById('drawerItems');
const drawerTotal= document.getElementById('drawerTotal');
const overlay    = document.getElementById('cartOverlay');
const waBtn      = document.getElementById('whatsappBtn');

// --- Build the grid once ---
function buildGrid() {
  grid.innerHTML = PRODUCTS.map((p, i) => {
    const media = `
      <div class="tile-media" style="background:${p.grad}">
        <span class="tile-emoji" aria-hidden="true">${p.emoji}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy"
             onerror="this.remove()">
      </div>`;
    const price = `<span class="tile-price">${fmt(p.price)}<small>/${p.unit}</small></span>`;
    const ctrl  = `<div class="tile-ctrl" id="ctrl-${p.id}">${controlHTML(p.id)}</div>`;

    if (CARD_STYLE === 'catalog') {
      return `<article class="tile ${sizeClass(i)}" data-id="${p.id}">
        ${media}
        <div class="tile-body">
          <span class="tile-cat">${p.cat}</span>
          <h3 class="tile-name">${p.name}</h3>
          <div class="tile-foot">${price}${ctrl}</div>
        </div>
      </article>`;
    }
    // overlay style
    return `<article class="tile ${sizeClass(i)}" data-id="${p.id}">
      ${media}
      <div class="tile-scrim"></div>
      <span class="tile-cat">${p.cat}</span>
      <div class="tile-content">
        <h3 class="tile-name">${p.name}</h3>
        <div class="tile-foot">${price}${ctrl}</div>
      </div>
    </article>`;
  }).join('');
}

function controlHTML(id) {
  const q = state[id] || 0;
  if (q === 0) {
    return `<button class="add-btn" data-add="${id}" aria-label="Add ${byId(id).name}">Add <span>+</span></button>`;
  }
  return `<div class="stepper">
    <button data-dec="${id}" aria-label="Remove one">−</button>
    <span class="qty">${q}</span>
    <button data-inc="${id}" aria-label="Add one">+</button>
  </div>`;
}

// --- Cart mutations ---
function inc(id) { state[id] = (state[id] || 0) + 1; sync(id); bump(id); }
function dec(id) { if (!state[id]) return; state[id]--; if (state[id] <= 0) delete state[id]; sync(id); }

function sync(changedId) {
  if (changedId) {
    const c = document.getElementById('ctrl-' + changedId);
    if (c) c.innerHTML = controlHTML(changedId);
  }
  updateBar();
  updateDrawer();
}

// --- Cart bar ---
function updateBar() {
  const items = Object.values(state).reduce((a, b) => a + b, 0);
  const total = Object.entries(state).reduce((a, [id, q]) => a + byId(id).price * q, 0);
  cartCount.textContent = items;
  cartQty.textContent = items + (items === 1 ? ' item' : ' items');
  cartTotal.textContent = fmt(total);
  cartBar.classList.toggle('show', items > 0);
  if (items === 0) closeDrawer();
}

// --- Drawer ---
function updateDrawer() {
  const entries = Object.entries(state);
  if (!entries.length) {
    drawerItems.innerHTML = `<p class="drawer-empty">Your basket is empty.<br>Tap “Add” on any item to begin.</p>`;
  } else {
    drawerItems.innerHTML = entries.map(([id, q]) => {
      const p = byId(id);
      return `<div class="drawer-item">
        <span class="di-emoji" style="background:${p.grad}">${p.emoji}</span>
        <span class="di-info">
          <span class="di-name">${p.name}</span>
          <span class="di-price">${fmt(p.price)} × ${q} = <b>${fmt(p.price * q)}</b></span>
        </span>
        <span class="stepper stepper--sm">
          <button data-dec="${id}" aria-label="Remove one">−</button>
          <span class="qty">${q}</span>
          <button data-inc="${id}" aria-label="Add one">+</button>
        </span>
      </div>`;
    }).join('');
  }
  const total = Object.entries(state).reduce((a, [id, q]) => a + byId(id).price * q, 0);
  drawerTotal.textContent = fmt(total);
}

function openDrawer() {
  if (!Object.keys(state).length) return;
  drawer.classList.add('open');
  overlay.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
}

// --- Micro-animations ---
function bump(id) {
  cartBar.classList.remove('pulse'); void cartBar.offsetWidth; cartBar.classList.add('pulse');
  cartCount.classList.remove('pop');  void cartCount.offsetWidth; cartCount.classList.add('pop');
  const tile = grid.querySelector(`.tile[data-id="${id}"]`);
  if (tile) { tile.classList.remove('added'); void tile.offsetWidth; tile.classList.add('added'); }
}

// --- WhatsApp checkout ---
function orderOnWhatsApp() {
  const entries = Object.entries(state);
  if (!entries.length) return;
  let lines = [`Hello ${SHOP_NAME}! I'd like to place an order:`, ''];
  let total = 0;
  entries.forEach(([id, q], i) => {
    const p = byId(id);
    const line = p.price * q; total += line;
    lines.push(`${i + 1}. ${p.name} — ${q} × ${fmt(p.price)} = ${fmt(line)}`);
  });
  lines.push('', `Total: ${fmt(total)}`, '', 'Please confirm availability. Thank you!');
  const url = `https://wa.me/${SHOP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank');
}

// --- Events (delegated) ---
grid.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  const up  = e.target.closest('[data-inc]');
  const dn  = e.target.closest('[data-dec]');
  if (add) inc(add.dataset.add);
  else if (up) inc(up.dataset.inc);
  else if (dn) dec(dn.dataset.dec);
});
drawerItems.addEventListener('click', e => {
  const up = e.target.closest('[data-inc]');
  const dn = e.target.closest('[data-dec]');
  if (up) inc(up.dataset.inc);
  else if (dn) dec(dn.dataset.dec);
});
cartBar.addEventListener('click', openDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
waBtn.addEventListener('click', orderOnWhatsApp);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// --- PIN-code delivery gate ---
const pinGate    = document.getElementById('pinGate');
const pinForm    = document.getElementById('pinForm');
const pinInput   = document.getElementById('pinInput');
const pinMsg     = document.getElementById('pinMsg');
const deliverBadge = document.getElementById('deliverBadge');
const deliverPin   = document.getElementById('deliverPin');

function openGate() {
  pinGate.classList.add('show');
  document.body.classList.add('gated');
  setTimeout(() => pinInput && pinInput.focus(), 60);
}
function closeGate() {
  pinGate.classList.remove('show');
  document.body.classList.remove('gated');
}

if (pinInput) {
  pinInput.addEventListener('input', () => {
    pinInput.value = pinInput.value.replace(/\D/g, '').slice(0, 6);
    pinMsg.textContent = '';
    pinMsg.className = 'pin-msg';
  });
}
if (pinForm) {
  pinForm.addEventListener('submit', e => {
    e.preventDefault();
    const pin = pinInput.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      pinMsg.className = 'pin-msg err';
      pinMsg.textContent = 'Please enter a valid 6-digit PIN code.';
      return;
    }
    if (SERVICEABLE.includes(pin)) {
      pinMsg.className = 'pin-msg ok';
      pinMsg.textContent = 'Great news — we deliver to your area! 🎉';
      if (deliverPin) deliverPin.textContent = pin;
      if (deliverBadge) deliverBadge.hidden = false;
      setTimeout(closeGate, 650);
    } else {
      pinMsg.className = 'pin-msg err';
      pinMsg.innerHTML = `Sorry — we don’t deliver to <b>${pin}</b> just yet. ` +
        `We currently serve <b>560087</b>, <b>560066</b> &amp; <b>560037</b>. ` +
        `Please try another PIN code.`;
    }
  });
}
if (deliverBadge) deliverBadge.addEventListener('click', openGate);

// --- Init ---
buildGrid();
updateBar();
updateDrawer();
openGate();
