# Pooja Store — Design Directions

Three distinct visual design directions for a pooja store (Hindu religious
items) e-commerce homepage, built as a static demo for client design approval.

All three share the **same Zepto-style cart interaction** (add-to-cart stepper
directly on product cards, sticky cart bar, expandable cart drawer, and a
"Order on WhatsApp" checkout) — only the typography, colour, layout and
personality differ, so the UX comparison stays apples-to-apples.

## The 3 directions

| Folder | Direction | Personality |
| ------ | --------- | ----------- |
| [`design-1-traditional`](design-1-traditional/index.html) | **Traditional / Warm** | Temple aesthetics — maroon, temple gold, marigold. Marcellus + Cormorant + Mukta. Scalloped torana border, arched cards, flickering diyas. |
| [`design-2-minimal`](design-2-minimal/index.html) | **Minimal / Clean** | Premium boutique catalogue — off-white, soft gold, terracotta. Manrope + Cormorant. Generous whitespace, numbered sections. |
| [`design-3-festive`](design-3-festive/index.html) | **Festive / Vibrant** | Festival-season energy — marigold, vermilion, magenta, leaf green. Baloo 2 + Mukta. Swaying toran bunting, confetti hero, ribbon tags. |

## How to view

No build step, no server, no dependencies. Just open any of these in a browser:

- `design-1-traditional/index.html`
- `design-2-minimal/index.html`
- `design-3-festive/index.html`

## Cart demo (fully functional)

- **+ / stepper** on each product card adds/removes instantly
- **Sticky cart bar** appears with live item count + running total
- **Tap the bar** to expand the cart summary
- **Order on WhatsApp** builds a `wa.me` link pre-filled with the cart items,
  quantities and total

State is in-memory only (vanilla JS) — nothing is persisted or fetched. The
WhatsApp number is a placeholder (`91XXXXXXXXXX`); replace it in each
`script.js` before going live.

---

*Throwaway visual + interaction prototype for design approval — not the
production site.*
