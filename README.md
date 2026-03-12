# elm-st-web

Web corporativa de Elm St. (productora audiovisual), actualmente en proceso de profesionalización técnica y migración a Netlify.

## Estado del proyecto
- Estado: en modernización.
- Hosting objetivo: Netlify.
- Dominio objetivo de operación: `elmst.ibaifernandez.com`.
- Decisión de negocio: no mantener `elmst.net` a largo plazo.
- Modo actual: freeze de diseño/copy, mejoras solo técnicas.
- Git flow activo: `main` (producción protegida) + `legacy` (archivo histórico).

## Documentación base
- [PRD](./PRD.md)
- [Reglas IA](./IA-RULES.md)
- [Arquitectura](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md)
- [Backlog](./BACKLOG.md)
- [Guía de agentes](./AGENTS.md)
- [Estrategia i18n](./I18N-STRATEGY.md)
- [Changelog](./CHANGELOG.md)
- [Runbook de alertas](./ALERTING.md)
- [QA Desktop CSV](./qa/qa-desktop.csv)
- [QA Mobile CSV](./qa/qa-mobile.csv)

## Estructura actual (legacy)
- Páginas: `inicio.html`, `nosotros.html`, `portafolio.html`, `contacto.html`, `error-404.html`, `en-construccion.html`.
- Rutas EN: `en/index.html`, `en/about.html`, `en/portfolio.html`, `en/contact.html`.
- Dossier técnico: `dossier-tecnico.html`, `en/technical-dossier.html`.
- Navegación principal: incluye CTA visible a "Dossier" (ES/EN) con estilo diferenciado.
- Estilos: `css/`
- Scripts: `js/`, `vendor/`, `rs-plugin/`
- Activos: `images/`, `videos/`, `fonts/`
- Formulario: Netlify Function `/.netlify/functions/submit-contact` (persistencia en logs de función, sin backend PHP)
- Selector de idioma: boton flotante inferior izquierdo (ES/EN), con fallback en navegacion legacy.

## Infra de migración ya preparada
- `netlify.toml`
- `_redirects`
- `_headers`
- `index.html` (entrada principal)
- `404.html` (fallback de Netlify)
- `netlify/functions/runtime-config.js`, `netlify/functions/verify-turnstile.js` y `netlify/functions/submit-contact.js` (runtime config + captcha + submit serverless)
- `performance-budgets.json` + scripts de budgets/reporte técnico por release

## Hallazgos clave de auditoría inicial
- Dependencias frontend antiguas (jQuery 1.x, Bootstrap 3.x).
- Dominio antiguo referenciado en sitemap/robots y otros archivos.
- Recursos `http://` que pueden provocar mixed content.
- Accesibilidad mejorable (muchas imágenes sin `alt` útil).
- Endpoint PHP incompatible con Netlify tal como está.

## Objetivo inmediato
Completar una migración segura a Netlify sin regresiones funcionales, dejando una base sólida para iterar SEO, accesibilidad, rendimiento y seguridad.

## Estado de quality gate
- `quality:ci`: en verde.
- Checks en verde: lint (HTML/JS/CSS), netlify config, links/mixed-content, E2E, a11y (axe), visual regression (ES), Lighthouse (ES+EN).
- Umbrales Lighthouse activos: Performance >= 90, Accessibility >= 95, SEO >= 95, Best Practices >= 95.
- Budgets por ruta: activos y validados por `npm run test:budgets`.
- Reporte técnico versionado más reciente: `reports/releases/2026-03-10.md`.

## LLM discovery (`llms.txt`)
- Archivo canónico: `llms.txt` en la raíz del proyecto.
- Compatibilidad: `LLM.txt` se mantiene y redirige a `llms.txt` en Netlify.

## Desarrollo local
El proyecto actual es estático y puede servirse localmente con un servidor HTTP simple.

Ejemplo:

```bash
python3 -m http.server 8080
```

Luego abre [http://localhost:8080](http://localhost:8080).

## Calidad y tests (npm)
Instalación:

```bash
nvm use
npm install
```

Requisito de runtime:
- Node `20` (ver `.nvmrc`; CI tambien usa Node 20).

Comandos principales:

```bash
npm run test:lint
npm run test:netlify
npm run test:links
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:lighthouse
npm run test:budgets
npm run report:release
npm run quality:ci
```

Notas:
- `test:visual` requiere snapshots base; para generarlos: `npm run test:visual:update`.
- El workflow de CI está en `.github/workflows/quality-gate.yml`, bloquea con fallo en cualquier check y admite disparo manual (`workflow_dispatch`).
- Además corre semanalmente por `schedule` (lunes 13:00 UTC) sobre la rama por defecto del repositorio (`main`).
- Ejecución manual por CLI: `gh workflow run "Quality Gate" --ref <rama>`.
- `LHCI_GITHUB_APP_TOKEN` es opcional; si existe en GitHub Secrets, Lighthouse puede publicar anotaciones más completas en PRs.
- El check de enlaces externos usa `scripts/external-link-ignore.json` para URLs legacy o dominios aún no publicados.
- La suite axe en `test:a11y` ya no excluye `color-contrast`; los contrastes críticos se corrigen en CSS manteniendo freeze visual/copy.
- La QA manual de marca/tono y de experiencia en desktop/mobile se registra en `qa/qa-desktop.csv` y `qa/qa-mobile.csv`.

## Captcha opcional (Turnstile)
El formulario funciona con endpoint serverless propio + honeypot. Si activas captcha invisible:

1. Define en Netlify:
   - `TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
2. Redeploy del sitio.

Con ambas variables presentes:
- El frontend solicita el site key vía `/.netlify/functions/runtime-config`.
- `js/main.js` ejecuta Turnstile invisible.
- `/.netlify/functions/submit-contact` valida token en servidor antes de aceptar el mensaje.

Persistencia/envío:
- Guarda el mensaje en logs de la Netlify Function (sin exponer secretos en frontend).
- Opcional: envío de email con Resend si defines `RESEND_API_KEY` y `CONTACT_TO_EMAIL` (`CONTACT_FROM_EMAIL` opcional).

## Observabilidad (Sentry + Uptime)
Frontend error monitoring está integrado de forma opcional y sin cambio visual/copy.

1. Define en Netlify:
   - `SENTRY_DSN`
   - `SENTRY_ENVIRONMENT` (ejemplo: `production`)
   - `SENTRY_RELEASE` (opcional)
2. Redeploy del sitio.

Con variables presentes:
- El frontend solicita `sentryDsn`, `sentryEnvironment`, `sentryRelease` vía `/.netlify/functions/runtime-config`.
- `js/main.js` carga SDK de Sentry en runtime (`js.sentry-cdn.com`) y reporta errores JS.
- `SENTRY_ENVIRONMENT` se normaliza automáticamente a minúsculas en runtime para mantener filtros consistentes (`production`).
- CSP en `_headers` permite dominios de carga/ingesta de Sentry.

Uptime externo:
- Monitor HTTP activo en UptimeRobot sobre `https://elmst.ibaifernandez.com`.

## Próximos pasos
Seguir el orden de prioridades definido en `BACKLOG.md` empezando por tareas P0 de plataforma/migración.
