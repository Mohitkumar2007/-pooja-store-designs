# Pooja Store — Design Directions

Three distinct visual design directions for a pooja store e-commerce homepage,
built as a static demo for client design approval.

All three share the **same Zepto-style cart interaction** (add-to-cart stepper
directly on product cards, sticky cart bar, expandable cart drawer, and an
"Order on WhatsApp" checkout) — only the typography, colour, layout and
personality differ, so the UX comparison stays apples-to-apples.

Design language is **English-only and product-first** — clean modern retail,
no religious ornamentation. Every direction uses a **bento grid** (mixed tile
sizes), is **mobile-first**, and pulls in **real photography** so the client
can picture the finished store.

## The 3 directions

| Folder | Direction | Personality |
| ------ | --------- | ----------- |
| [`design-1-traditional`](design-1-traditional/index.html) | **Traditional / Warm** | Warm, hand-made shop feel — terracotta clay, espresso, muted brass gold on warm paper. **Fraunces** serif + **Hind**. Brass-seal monogram, arched feature tile, photo-overlay bento. |
| [`design-2-minimal`](design-2-minimal/index.html) | **Minimal / Clean** | Premium boutique catalogue — bone white, ink, soft gold. **Cormorant** display + **Manrope**. Hairline gold rules, serif section numerals, gallery cards, lots of whitespace. |
| [`design-3-bold`](design-3-bold/index.html) | **Bold / Modern** | Energetic but disciplined — deep plum with sunset-orange / coral / amber. **Space Grotesk** + **Manrope**. Gradient headline, soft blob shapes, colour-blocked bento. |

## How to view

No build step, no server, no dependencies. Just open any of these in a browser:

- `design-1-traditional/index.html`
- `design-2-minimal/index.html`
- `design-3-bold/index.html`

## Cart demo (fully functional)

- **+ / stepper** on each product card adds/removes instantly
- **Sticky cart bar** appears with live item count + running total
- **Tap the bar** to expand the cart summary (change quantities inline)
- **Order on WhatsApp** builds a `wa.me` link pre-filled with the cart items,
  quantities and total

State is in-memory only (vanilla JS) — nothing is persisted or fetched.

## Images

Product tiles and the hero use **real Unsplash photography** loaded directly by
the browser. Each tile also has a matching colour-gradient + icon base layer, so
if a photo is ever unavailable the tile still looks intentional (never a broken
box). Swap in the shop's own product photos by editing the `img` values in
`script.js`.

## Going live — two placeholders to swap

- **WhatsApp number** — replace `91XXXXXXXXXX` (`SHOP_NUMBER` at the top of each
  `script.js`).
- **Product photos** — replace the Unsplash `img` URLs in the `PRODUCTS` array.

---

*Throwaway visual + interaction prototype for design approval — not the
production site. Pricing and imagery are placeholders.*
