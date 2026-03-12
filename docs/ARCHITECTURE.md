# ARCHITECTURE - elm-st-web

## 1) Estado actual (as-is)
- Sitio multipágina estático en raíz (`index.html`, `nosotros.html`, `portafolio.html`, `contacto.html`, `dossier-tecnico.html`, `404.html`).
- Espejo EN publicado en `en/` (`index.html`, `about.html`, `portfolio.html`, `contact.html`, `technical-dossier.html`).
- Frontend legacy con jQuery + Bootstrap 3 + plugins antiguos.
- Formulario operativo vía Netlify Functions (`/.netlify/functions/submit-contact`) con validación server-side, honeypot, Turnstile opcional y entrega por Resend.
- Routing bilingüe ES/EN publicado (`/` y `/en/` con mirrors de páginas públicas).
- Despliegue operativo en Netlify para `elmst.ibaifernandez.com`.
- Documentación operativa, QA y reportes centralizados en `docs/`.

### Hallazgos de auditoría relevantes
- Dependencias legacy: jQuery 1.11.2/1.11.3, Bootstrap 3.3.5.
- Recursos externos en `https://`; mixed content bloqueado por pipeline.
- `robots.txt`, `sitemap.xml`, `sitemap.html` y `urllist.txt` alineados con dominio activo.
- Metadatos SEO completos en rutas críticas (canonical, `hreflang`, OG, Twitter).
- Accesibilidad y contraste endurecidos para pasar axe sin excepciones.
- API key de Google Maps eliminada del runtime público activo.
- Hardening de captcha invisible activo (Turnstile + verificación serverless).
- Stack frontend legacy estable, con deuda técnica conocida pero acotada.

## 2) Arquitectura objetivo (to-be)
### Principios
- Static-first sobre Netlify CDN.
- Seguridad y performance por defecto.
- Evolución incremental: migración estable primero, modernización después.

### Capas
- Capa de presentación: páginas estáticas optimizadas.
- Capa de integración: Netlify Functions (`runtime-config`, `verify-turnstile`, `submit-contact`) y Resend opcional para entrega de formularios.
- Capa de entrega: Netlify (deploys versionados, previews, CDN global).
- Capa de observabilidad: analítica + monitoreo de errores (Sentry) + uptime externo (UptimeRobot).

## 3) Dominio y routing
- Dominio principal de producción: `elmst.ibaifernandez.com`.
- Dominio `elmst.net`: decisión de negocio de no mantenerlo.
- Estrategia de rutas:
  - `/` como entrada principal.
  - `/inicio.html` y `/error-404.html` quedan solo como URLs legacy atendidas por redirects.
  - URLs canónicas estables para `/nosotros`, `/portafolio`, `/contacto` (con o sin `.html`, pero consistentes).

## 3.1) Routing bilingüe objetivo (ES/EN)
- ES (default): `/`, `/nosotros.html`, `/portafolio.html`, `/contacto.html`.
- EN (mirror): `/en/`, `/en/about.html`, `/en/portfolio.html`, `/en/contact.html`.
- Cada URL debe tener canonical propio y alternates `hreflang` cruzados.
- `x-default` inicialmente apuntará a `/` (ES) hasta decisión comercial.
- `404.html` es único a nivel Netlify y adapta shell/copy ES/EN en runtime según el prefijo de la ruta (`/en/*` => experiencia 404 en inglés).

## 4) Deploy en Netlify
- Entorno `production`: rama principal.
- Entornos `deploy-preview`: validación por cambio.
- Archivos de plataforma a incorporar:
  - `netlify.toml`
  - `_redirects`
  - `_headers`

## 5) Seguridad objetivo
- Headers mínimos:
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Sin secretos en frontend.
- Validación de inputs y protección anti-spam en contacto:
  - honeypot activo en `submit-contact`.
  - captcha invisible activo con Turnstile y verificación serverless.
  - envío transaccional desacoplado vía Resend.

## 6) SEO objetivo
- Canonical por página.
- Open Graph + Twitter cards.
- `robots.txt` y `sitemap.xml` del dominio activo.
- 404 real y rastreable.
- `hreflang` ES/EN por pares equivalentes.
- Sitemap bilingüe cuando EN entre en producción.

## 7) Rendimiento objetivo
- Optimización de imágenes (formatos modernos y tamaños responsivos).
- Eliminación de dependencias duplicadas/no usadas.
- Carga diferida de JS no crítico.
- Presupuesto de performance por página.

## 8) Decisiones técnicas abiertas
- D-01: Mantener HTML estático puro o migrar a stack con build moderno (Astro/Vite).
- D-02 (resuelta): Contacto vía Netlify Functions + Resend opcional; no se usa Netlify Forms como canal productivo.
- D-03: Alcance del rediseño visual en fase 1 vs fase 2.
- D-04 (resuelta): Selector de idioma flotante tipo "pelotita" abajo izquierda, generado desde rutas ES/EN existentes sin alterar copy.
- D-05 (resuelta): Turnstile activo en producción; se mantiene como capa adicional de seguridad sobre `submit-contact`.
