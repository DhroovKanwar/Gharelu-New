# Gharelu.Bake — Premium Eggless Bakery Website

## Problem Statement (original)
Build a premium, award-worthy (Awwwards-level) marketing website for "Gharelu.Bake"
(Pure • Premium • Eggless). Frontend-only, no backend, API-ready with dummy data.
Stack requested: React + Tailwind + React Router + Framer Motion + React Icons.
Inspired by (not copied from) references like Crumbl; must feel luxury/editorial.

Homepage sections required: Announcement Bar, Navbar, Hero, Featured Cakes,
Categories, Why Choose Us, Corporate Gifting, Events, Gallery Preview, Instagram
Feed, Testimonials, FAQ, Newsletter, Location, Footer.

## Tech Notes
- Environment uses CRA + CRACO (supervisor-managed on :3000), NOT Vite. Same libs,
  same visual result. Vite would break supervisor; kept CRA.
- Added libs: `lenis` (smooth momentum scroll), `react-fast-marquee`.
  Existing: framer-motion 11, lucide-react, react-router-dom 7, sonner.
- No backend built. API layer is mocked in `src/services/api.js` (swap mock() for
  axios calls to `${API}/...` with zero component changes).

## Brand System
- Colors: primary #EFC7D3, secondary #F9E8ED, accent #D7869F, bg #FFFDFB,
  dark #262626, text #444444, border #F3D6DE (Tailwind: `brand.*`).
- Fonts: Poppins ExtraBold (headings), Inter (body). Loaded via index.html.
- Logo: text wordmark "Gharelu.Bake" (accent on ".Bake"). Source PDF provided.

## Folder Structure (src/)
components/common (Button, Card/ProductCard, SectionHeading, Reveal/MaskedLines,
Container, Section), components/sections (all 15 homepage sections),
layouts (MainLayout), pages (Home), hooks (useLenis), services (api),
data (content.js — all dummy data), animations (variants), utils (cn).

## What's Implemented (2026-07-29)
- Full single-page homepage with all 15 required sections. ✓ verified via screenshots.
- Signature motion: Lenis smooth scroll, hero line-by-line masked reveal + parallax
  + rotating "Pure Premium Eggless" seal, scroll reveals on every section,
  editorial marquee, luxury product cards w/ slide-up add button.
- Functional newsletter form (mock subscribe + sonner toast). ✓ verified.
- Responsive (desktop + mobile w/ animated menu). ✓ verified.
- All interactive elements have data-testid.

## Backlog / Next Actions
- P1: Wire real backend (FastAPI + Mongo) for newsletter + order enquiries;
  service layer already API-ready.
- P1: Product detail / catalog pages + cart (currently CTA-only cards).
- P2: Real product photography swap, CMS for events/gallery, Instagram Graph API.
- P2: Replace placeholder Google Map embed with pinned business location.
