# Pooja Store — Design Directions

Static demo of a pooja store, built for client design approval.

The **Traditional** and **Minimal** directions are now full **quick-commerce
app** layouts (Zepto / Blinkit style) — the same feature set and UX, styled two
different ways so the comparison stays apples-to-apples. **Bold** remains a
simpler single-page bento concept as an alternate look.

Design language is **English-only and product-first** — modern retail, no
religious ornamentation. Everything is **mobile-first** and pulls in **real
Unsplash photography** (with a branded SVG fallback, so nothing ever looks
broken) so the client can picture the finished store.

## The directions

| Folder | Direction | Personality |
| ------ | --------- | ----------- |
| [`design-1-traditional`](design-1-traditional/index.html) | **Traditional / Warm** | Warm, hand-made shop feel — terracotta clay, espresso, brass gold on warm paper. **Fraunces** serif + **Hind**. Serif prices, brass rating pills, warm clay cart bar. |
| [`design-2-minimal`](design-2-minimal/index.html) | **Minimal / Clean** | Premium boutique — bone white, ink, soft gold, hairline borders, lots of light. **Cormorant** display serif + **Manrope**. Flat cards, ink cart bar. |
| [`design-3-bold`](design-3-bold/index.html) | **Bold / Modern** | Energetic but disciplined — deep plum with sunset-orange / coral / amber. **Space Grotesk** + **Manrope**. Colour-blocked bento (single-page concept). |

## What's in the quick-commerce apps (Traditional & Minimal)

- **PIN-code delivery gate** on entry — serviceable PINs `560087 / 560066 /
  560037` open the store; anything else shows a "we don't deliver there yet"
  message and blocks entry. A `📍 PIN` badge in the header reopens it.
- **Search** (with live filtering + suggestions) and **shop-by-category** rail
- **Product rails** — Popular, Best sellers, Recommended, Recently viewed
- **Promo carousel**, **festival collection** banner, **customer reviews**
- **Product quick-view** sheet (gallery, details, bundle & similar items)
- **Zepto-style cart** — `ADD` / stepper on every card, sticky cart bar with
  live total, slide-up cart drawer with coupon field
- **Checkout on WhatsApp** — builds a `wa.me` link pre-filled with items,
  quantities and total
- **Mobile bottom nav**, floating WhatsApp button, back-to-top

State is in-memory only (vanilla JS) — nothing is persisted or fetched.

## How to view

No build step, no server, no dependencies — just open any `index.html` in a
browser.

## Going live — placeholders to swap

- **WhatsApp number** — `SHOP_NUMBER` at the top of each `script.js`
  (currently `91XXXXXXXXXX`).
- **Serviceable PIN codes** — `SERVICEABLE` array in `script.js`.
- **Product photos** — the Unsplash `image` URLs in the `PRODUCTS` /
  `CATEGORIES` arrays in `script.js`.

---

*Throwaway visual + interaction prototype for design approval — not the
production site. Pricing and imagery are placeholders.*
