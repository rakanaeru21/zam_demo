# Zamzam Cafe & Shisha Lounge

## Overview

This is a static website concept for **Zamzam Cafe & Shisha Lounge**, an
Arabian-inspired hospitality destination in Jakarta. The visual direction is
**Modern Arabian Luxury** — dark, editorial, warm lighting, minimal gold
accents, and spacious, uncluttered layouts.

The venue combines:

- Cafe
- Food
- Shisha
- Lounge
- Tennis Court
- VIP Room & Lounge
- Event & Meeting Hall

All visible website copy is written in natural, premium Indonesian.

## Features

- Responsive design (1440px down to 360px)
- Modern Arabian luxury visual identity
- Transparent, sticky navigation with scroll-based dark/blur state
- Mobile hamburger navigation with smooth open/close animation
- Smooth scrolling between sections
- Scroll-reveal animations via IntersectionObserver
- Signature menu section (editorial layout, no cards)
- Dedicated Tennis Court section
- Lounge & Facilities section (VIP Room, Event Hall, Lounge)
- Reservation section with client-side form validation
- Accessible semantic HTML, keyboard-friendly navigation
- Respects `prefers-reduced-motion`

## Tech Stack

- HTML5
- CSS3 (no framework)
- Vanilla JavaScript (no libraries)

No React, Vue, Angular, Bootstrap, Tailwind, jQuery, or build tools are used.

## Color Palette

| Color | Hex | Usage |
|---|---|---|
| Emerald Green | `#144D34` | Primary brand color |
| Elegant Gold | `#D4AF37` | Main accent (used sparingly) |
| Dark Gold | `#A88A3D` | Secondary accent / hover states |
| Cream | `#F7F1E3` | Light background / text on dark |
| Dark | `#171C18` | Dark background / body text |
| Secondary Dark | `#0F120F` | Footer / deepest background |

## Typography

- **Cormorant Garamond** — hero heading, section headings, dish names
- **Inter** — navigation, paragraphs, buttons, forms, small labels

Loaded from Google Fonts in `index.html`.

## Business Information

**Zamzam Cafe & Shisha Lounge**

Open Daily: **11.00–23.59 WIB**

Services: Shisha • Cafe • Food • Tennis Court • VIP Room & Lounge • Event & Meeting Hall

## Project Structure

```
Zamzam-Cafe/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/          (empty — reserved for local image assets)
```

## How to Run

**Option 1 — Open directly**

Double-click `index.html`, or open it in any modern browser.

**Option 2 — VS Code Live Server**

1. Open the `Zamzam-Cafe` folder in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

## Customization

- **Restaurant name / brand text** — edit `.brand-name` / `.brand-sub` in
  `index.html` (appears in the header and footer).
- **Colors** — change the CSS custom properties at the top of
  `css/style.css` under `:root` (`--emerald`, `--gold`, `--gold-dark`,
  `--cream`, `--dark`, `--dark-2`).
- **Typography** — swap the Google Fonts `<link>` in `index.html` and update
  `--font-display` / `--font-body` in `css/style.css`.
- **Menu items & prices** — edit the `.menu-item` articles inside the
  `#menu` section of `index.html`.
- **Images** — replace the `src` attributes on `<img>` tags (see *Image
  Sources* below); local files can be placed in `assets/images/` and
  referenced with a relative path, e.g. `assets/images/hero.jpg`.
- **Contact information** — edit the `Kontak` column in the footer.
- **Opening hours** — search for `11.00–23.59 WIB` across `index.html` and
  update all occurrences (hero, tennis section, footer).
- **Tennis Court information** — edit the `#tennis` section (lapangan type,
  operating hours).
- **Reservation form** — fields and validation logic live in the
  `#reservasi` section of `index.html` and the "Reservation form
  validation" block in `js/script.js`.

## Image Sources

The current build uses placeholder photography served on demand from
**LoremFlickr** (`https://loremflickr.com`), which returns real, freely
usable stock-style photos matched to keyword tags (e.g. `restaurant`,
`tennis`, `baklava`). These are intended as easy-to-replace placeholders,
not final production imagery:

- Hero — `loremflickr.com/1920/1200/arabiclounge,restaurant,dark`
- About — `loremflickr.com/1200/1500/middleeastern,restaurant,interior`
- Menu — Lamb Mandi, Shawarma Platter, Arabic Mixed Grill, Pistachio Baklava
  (each keyed to its own food-related keyword set)
- Tennis Court — `loremflickr.com/1200/1500/tenniscourt,night,sport`
- Lounge — `loremflickr.com/1920/1100/luxurylounge,bar,arabic`

Before launch, replace these with licensed photography of the actual venue,
or with images from a properly licensed stock library (e.g. Unsplash,
Getty Images) matching the same aspect ratios noted in `css/style.css`
(`object-fit: cover` is used throughout, so exact cropping is flexible).

## License

This is a static website concept built for demonstration purposes.
Third-party fonts (Google Fonts) and placeholder images have their own
licenses — verify licensing before commercial use, and replace all
placeholder imagery with properly licensed or owned photography.
