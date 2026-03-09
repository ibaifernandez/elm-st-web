# ARCHITECTURE - elm-st-web

## 1) Estado actual (as-is)
- Sitio multipágina estático en raíz (`inicio.html`, `nosotros.html`, `portafolio.html`, `contacto.html`, etc.).
- Frontend legacy con jQuery + Bootstrap 3 + plugins antiguos.
- Formulario con POST a `php/submit.php`.
- Despliegue actual acoplado a cPanel (`.cpanel.yml`).

### Hallazgos de auditoría relevantes
- Dependencias legacy: jQuery 1.11.2/1.11.3, Bootstrap 3.3.5.
- Recursos externos con `http://` en varias páginas.
- `robots.txt`, `sitemap.xml`, `sitemap.html` y `urllist.txt` apuntando a `elmst.tv`.
- Metadatos SEO básicos pero incompletos (sin canonical/OG/Twitter).
- 53 imágenes con `alt=""` y varias sin `alt`.
- API key de Google Maps expuesta en HTML.
- Formulario PHP sin validación/saneado robusto.
- Activos pesados y residuos (`Thumbs.db`, vídeo principal grande).

## 2) Arquitectura objetivo (to-be)
### Principios
- Static-first sobre Netlify CDN.
- Seguridad y performance por defecto.
- Evolución incremental: migración estable primero, modernización después.

### Capas
- Capa de presentación: páginas estáticas optimizadas.
- Capa de integración: formulario en Netlify Functions o Netlify Forms.
- Capa de entrega: Netlify (deploys versionados, previews, CDN global).
- Capa de observabilidad: analítica + monitoreo de errores.

## 3) Dominio y routing
- Dominio principal de producción: `elmst.ibaifernandez.com`.
- Dominio `elmst.net`: decisión de negocio de no mantenerlo.
- Estrategia de rutas:
  - `/` como entrada principal (consolidar `inicio.html` hacia `index.html` en la migración).
  - URLs canónicas estables para `/nosotros`, `/portafolio`, `/contacto` (con o sin `.html`, pero consistentes).

## 3.1) Routing bilingüe objetivo (ES/EN)
- ES (default): `/`, `/nosotros.html`, `/portafolio.html`, `/contacto.html`.
- EN (mirror): `/en/`, `/en/about.html`, `/en/portfolio.html`, `/en/contact.html`.
- Cada URL debe tener canonical propio y alternates `hreflang` cruzados.
- `x-default` inicialmente apuntará a `/` (ES) hasta decisión comercial.

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
- Validación de inputs lado servidor para contacto.

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
- D-02: Contacto vía Netlify Forms vs Function + proveedor de email.
- D-03: Alcance del rediseño visual en fase 1 vs fase 2.
- D-04: Estrategia final del selector de idioma sin romper freeze visual.
