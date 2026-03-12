# I18N STRATEGY - elm-st-web (ES/EN)

## 1) Goal
Deliver a fully bilingual public website (Spanish/English) while preserving the active visual and editorial freeze for current Spanish pages.

## 2) Freeze constraints
- Do not modify existing design system: layout, typography, colors, spacing, components, or imagery.
- Do not alter existing Spanish editorial content in current public pages.
- Bilingual rollout must be additive and parity-based.
- Allowed exception approved for UX: floating language switcher (`pelotita`) in bottom-left corner.

## 3) Routing strategy
- Spanish (default):
  - `/` (home)
  - `/nosotros.html`
  - `/portafolio.html`
  - `/contacto.html`
- English (mirror routes):
  - `/en/` (home EN)
  - `/en/about.html`
  - `/en/portfolio.html`
  - `/en/contact.html`

## 4) SEO strategy for bilingual
- Add `link rel="alternate" hreflang="es"` and `hreflang="en"` per equivalent page pair.
- Add `x-default` pointing to Spanish home until product decides otherwise.
- Keep one canonical per language URL (self-referencing canonical).
- Publish bilingual sitemap entries once EN pages are live.
- Netlify 404 fallback is global (`/404.html`), so the error shell must localize client-side based on the requested path (`/en/*` => English copy/navigation).

## 5) Quality gates (ES and EN)
- Extend E2E to cover both language trees.
- Extend accessibility tests for EN routes.
- Extend visual regression baselines for EN routes.
- Extend Lighthouse URLs list with EN routes (same thresholds).
- Extend link checker expectations for bilingual internal links.

## 6) Delivery phases
1. Architecture and docs (done).
2. Route scaffolding and navigation parity (done).
3. EN copy integration + metadata/OG/Twitter definition (done, pending tone QA).
4. SEO hreflang + sitemap publication (done).
5. Full bilingual QA and release (in progress).

## 7) Required inputs from business
- Optional tone review for EN copy and metadata (brand voice refinement).
- Legal/privacy bilingual text if contact/compliance pages are added later.
- DNS/Netlify operational access for final production ownership tasks.

## 8) Risks
- If EN copy is not approved centrally, bilingual release will stall.
- If `elmst.net` expires with external backlinks not updated, ranking transfer to new domain may be slower.
- Tight Lighthouse thresholds can fail intermittently if legacy assets are not optimized.
