# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Planned
- Bilingual implementation ES/EN for public routes (pending approved EN copy).

## [2026-03-09]

### Added
- Linux visual baseline snapshots for CI stability:
  - `tests/visual.spec.js-snapshots/*-chromium-linux.png`
- WebP optimized assets for critical home visuals:
  - `images/slides/slide-1.webp`
  - `images/slides/slide-2.webp`
  - `images/bg/testi-bg.webp`

### Changed
- Home routes now prefer optimized WebP with safe fallback:
  - `index.html`, `inicio.html`, `en/index.html` use `srcset` for hero slides.
  - `css/style.css` uses `image-set(...)` for testimonial/parallax background.
- Quality workflow trigger updated for branch strategy:
  - push now includes `codex` and `codex/**`.
- Visual regression stability in CI:
  - targeted `maxDiffPixelRatio` tolerance added for known Linux drift cases in `tests/visual.spec.js`.

### Fixed
- GitHub Actions quality gate failure caused by missing Linux visual snapshots.
- Lighthouse threshold instability on `/` (Performance 0.89) by reducing critical image payload while keeping visual/copy freeze.

## [2026-03-08]

### Added
- Netlify infrastructure files: `netlify.toml`, `_redirects`, `_headers`.
- Netlify-compatible entry pages: `index.html` and `404.html`.
- Node runtime pin for local consistency: `.nvmrc` (`20`).
- LLM discovery file for crawlers/agents: `llms.txt` + uppercase mirror `LLM.txt`.
- Bilingual public routes (EN):
  - `en/index.html`
  - `en/about.html`
  - `en/portfolio.html`
  - `en/contact.html`
- Manual QA trackers in CSV format:
  - `qa/qa-desktop.csv`
  - `qa/qa-mobile.csv`
- Full quality suite and tooling:
  - Playwright E2E, accessibility (axe), and visual regression.
  - Lighthouse CI with score thresholds.
  - Link/mixed-content checker, HTML/JS/CSS linting, Netlify config checks.
- CI pipeline: `.github/workflows/quality-gate.yml` with blocking checks.
- Project governance docs:
  - `PRD.md`, `IA-RULES.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `BACKLOG.md`, `AGENTS.md`.

### Changed
- Contact form migration from legacy PHP endpoint to Netlify Forms-compatible flow.
- Domain references updated to `elmst.ibaifernandez.com` in robots/sitemap/url lists.
- Accessibility hardening:
  - `axe` checks now enforce `color-contrast` (exception removed).
  - Minimal contrast corrections in critical home sections to satisfy WCAG AA.
- Bilingual SEO and routing hardening:
  - Canonical + `hreflang` ES/EN wiring in ES and EN routes.
  - `_redirects`, `sitemap.xml`, `sitemap.html`, and `urllist.txt` updated with EN URLs.
  - `check-links` and lint scope expanded to include `en/*.html`.
  - E2E, a11y, and Lighthouse coverage extended to EN routes.
- Security hardening in links/resources:
  - `http://` dependencies replaced by `https://` where applicable.
  - safer `rel` attributes for external links.
- Performance hardening:
  - Deferred/non-blocking loading for non-critical fonts/CSS/analytics.
  - JPEG asset compression on high-weight media used by critical routes.
  - Guard clauses added in `js/main.js` for optional plugins to avoid runtime breaks.
- Documentation updated with bilingual strategy and migration status.
- LLM crawler discovery canonicalized:
  - `llms.txt` is canonical.
  - `_redirects` now enforces `/LLM.txt -> /llms.txt` (301).
- CI now reads optional Lighthouse GitHub token from repository secret:
  - `LHCI_GITHUB_APP_TOKEN` in `.github/workflows/quality-gate.yml`.
- CI workflow now supports manual dispatch:
  - `workflow_dispatch` enabled in `.github/workflows/quality-gate.yml`.
- CI push trigger now includes plain `codex` branch in addition to `codex/**`.

### Removed
- Legacy PHP form handlers:
  - `php/submit.php`
  - `php/submit-original.php`
- Unused Google Maps script blocks from pages where map was not present.

### Fixed
- Broken/malformed links (including duplicated protocol URLs).
- Missing asset for under-construction page (`images/en-construccion.jpg`).
- Multiple mixed-content risks detected in initial audit.
- External link checker stability for anti-bot URLs (allowlist for non-deterministic 3rd-party endpoints).
- Local Lighthouse failure caused by legacy Node 18 shell context.
