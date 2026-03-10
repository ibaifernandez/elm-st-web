# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Planned
- Bilingual implementation ES/EN for public routes (pending approved EN copy).

## [2026-03-10]

### Added
- Floating language switcher UX (portfolio-like "pelotita") generated from existing ES/EN route pairs:
  - implemented in `js/main.js` + styles in `css/style.css` and `css/responsive.css`.
- Optional invisible captcha hardening for contact forms:
  - `netlify/functions/runtime-config.js` (runtime site key exposure from env).
  - `netlify/functions/verify-turnstile.js` (server-side Turnstile verification).
- QA matrix extensions for manual review of new language switcher and captcha hardening:
  - `qa/qa-desktop.csv`
  - `qa/qa-mobile.csv`
- Runtime observability wiring for frontend errors:
  - `netlify/functions/runtime-config.js` now exposes sanitized `sentryDsn`, `sentryEnvironment`, and `sentryRelease`.
  - `js/main.js` initializes Sentry browser SDK conditionally from runtime config.

### Changed
- CSP updated to allow optional Turnstile runtime endpoints:
  - `_headers` now includes `https://challenges.cloudflare.com` in `script-src`, `connect-src`, and `frame-src`.
- CSP updated for Sentry browser SDK + ingest endpoints:
  - `_headers` now includes `https://js.sentry-cdn.com` in `script-src`.
  - `_headers` now includes Sentry ingest domains in `connect-src`.
- Local test server now stubs Netlify function endpoints used by form hardening:
  - `scripts/serve-test.mjs`.
- Netlify config validator now checks required function files:
  - `scripts/check-netlify-config.mjs`.
- E2E language-switch checks now validate the floating switcher contract instead of header text chip:
  - `tests/e2e.spec.js`.
- Backlog and roadmap synchronized with migration state, SEO/i18n completion, and captcha rollout status:
  - `BACKLOG.md`
  - `ROADMAP.md`

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
- Language UX:
  - visible ES/EN switch added in main navigation across public ES and EN pages.
- CI visual baselines refreshed after header language switch rollout:
  - `tests/visual.spec.js-snapshots/home-desktop-chromium-linux.png`
  - `tests/visual.spec.js-snapshots/home-mobile-chromium-linux.png`
- Slider image loading hardening (no visual/copy changes):
  - Home hero slides now load WebP as primary source with JPG fallback in `index.html` and `en/index.html`.
  - Revolution slider boot now enables `spinner:"off"` and lazy load flags in `js/main.js`.
- Typography delivery hardening:
  - `fonts/montserrat-fonts.css` now self-hosts `Montserrat` (`400/700`) with `font-display: swap`.
  - Google `Montserrat` remote stylesheet requests removed from public HTML pages; `Droid Serif` remains remote.
- Cross-platform visual baselines refreshed after typography and slider loading updates:
  - `tests/visual.spec.js-snapshots/*-chromium-darwin.png`
  - `tests/visual.spec.js-snapshots/*-chromium-linux.png`

### Fixed
- GitHub Actions quality gate failure caused by missing Linux visual snapshots.
- GitHub Actions quality gate failure (2026-03-09 run) caused by Linux home snapshot height drift (`+28px desktop`, `+56px mobile`) after nav updates.
- Intermittent quality drift caused by external font dependency and visual snapshot desync after performance hardening.
- Production redirect loop on English home (`/en/`) caused by a forced self-redirect rule in `_redirects`:
  - removed `/en /en/ 301!` and aligned `scripts/check-netlify-config.mjs`.
- Lighthouse threshold instability on `/` (Performance 0.89) by reducing critical image payload while keeping visual/copy freeze.
- Layering bug in "¿Cómo trabajamos en Elm St.?" section:
  - `.sec-choose .choose-tab` no longer overlays the fixed header while scrolling.
- External link checker stability:
  - allowlist updated for `https://instagram.com/monicamontufarq` anti-bot responses.
- Production captcha activation:
  - `/.netlify/functions/runtime-config` now returns configured Turnstile site key in production.
  - `/.netlify/functions/verify-turnstile` rejects missing tokens as expected (`Missing captcha token.`).
- Netlify form POST hardening:
  - Added explicit root rewrite rule (`/ /index.html 200`) as mitigation while diagnosing production `POST /` failures.
  - Added hidden Netlify "shadow form" in ES/EN home routes to force form detection at deploy-time.
  - Removed catch-all redirect `/* /404.html 404` to avoid intercepting non-GET requests before Netlify Forms processing.
  - Current status: Netlify still returns `404` for form submissions; final fix depends on Forms-side activation/detection in platform settings.
- Sentry browser boot sequence:
  - Fixed loader flow for `js.sentry-cdn.com` by supporting `Sentry.onLoad(...)` + `Sentry.forceLoad()` before `Sentry.init(...)`.

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
