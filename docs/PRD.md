# PRD - elm-st-web

## 1) Contexto
Elm St. es la web corporativa de la productora audiovisual. El proyecto actual funciona, pero está construido sobre una base legacy (HTML/CSS/JS/jQuery + PHP) y requiere una profesionalización completa antes de migrar de Bluehost a Netlify.

Este PRD define el producto objetivo para operar en `elmst.ibaifernandez.com`, con estándares altos de accesibilidad, SEO, rendimiento y seguridad.

## 2) Problema a resolver
- Infraestructura actual acoplada a Bluehost y a un formulario PHP no compatible con Netlify.
- Dependencias antiguas (jQuery 1.x, Bootstrap 3.x, plugins legacy) y deuda técnica acumulada.
- Señales SEO y técnica desactualizadas (sitemap/robots con dominio antiguo, metadatos incompletos, sin canonical ni Open Graph).
- Brechas de accesibilidad y calidad HTML.
- Riesgos de seguridad por prácticas antiguas (inputs sin saneado robusto, API key pública de Google Maps en HTML, enlaces externos sin hardening consistente).

## 3) Visión de producto
Construir una web corporativa "premium" de Elm St. que sea:
- Rápida y robusta en móvil.
- Claramente indexable y mantenible.
- Accesible (WCAG 2.2 AA como baseline).
- Segura por defecto.
- Sencilla de operar y desplegar en Netlify.
- Bilingüe (ES/EN) con paridad funcional y SEO internacional correcto.

## 4) Objetivos
### Objetivos de negocio
- Lanzar el nuevo sitio en `elmst.ibaifernandez.com` sin dependencia de Bluehost.
- Mejorar percepción de marca mediante calidad técnica visible.
- Mantener y mejorar capacidad de captación de contactos.
- Habilitar versión en inglés sin degradar la versión en español.

### Objetivos técnicos medibles
- Lighthouse (móvil, páginas principales):
  - Performance >= 90
  - Accessibility >= 95
  - SEO >= 95
  - Best Practices >= 95
- Core Web Vitals (p75):
  - LCP <= 2.5s
  - INP <= 200ms
  - CLS <= 0.1
- 100% de páginas indexables con:
  - `title` y `description` únicos
  - `canonical`
  - Open Graph y Twitter cards
- 100% de páginas públicas con versión ES y EN equivalente (cuando EN esté publicado).
- 0 recursos servidos por `http://` en producción.
- 0 endpoints PHP activos tras migración.

## 5) Alcance
### En alcance
- Migración de hosting a Netlify.
- Migración funcional del formulario de contacto (sin PHP).
- Revisión y mejora de SEO técnico on-page.
- Endurecimiento de seguridad frontend y headers.
- Optimización de carga (activos, imágenes, scripts, fuentes).
- Mejora de accesibilidad semántica y de interacción.
- Cambio de dominio operativo a `elmst.ibaifernandez.com`.
- Estrategia e implementación bilingüe ES/EN por fases.

### Fuera de alcance (fase inicial)
- Rediseño visual completo de marca desde cero.
- Implementación de CMS complejo.
- Plataforma e-commerce.
- Rediseño visual o cambios de copy no aprobados dentro del freeze.

## 6) Usuarios
- Clientes potenciales (B2B/B2C) que evalúan servicios audiovisuales.
- Partners/colaboradores que validan reputación y portafolio.
- Equipo interno que administra contenido y despliegues.

## 7) Requisitos funcionales
- RF-01: Navegación clara entre Inicio, Nosotros, Portafolio y Contacto.
- RF-02: Reproducción de vídeos y acceso al reel sin roturas.
- RF-03: Formulario de contacto operativo en Netlify con validación y protección anti-spam.
- RF-04: Sitemap y robots coherentes con dominio activo.
- RF-05: Tracking analítico moderno (GA4 o alternativa) con consentimiento si aplica.
- RF-06: Página 404 útil y consistente.
- RF-07: Disponibilidad de rutas ES/EN equivalentes para páginas públicas.
- RF-08: Etiquetado `hreflang` correcto para pares ES/EN.

## 8) Requisitos no funcionales
- RNF-01: Accesibilidad WCAG 2.2 AA.
- RNF-02: Seguridad por cabeceras (`CSP`, `HSTS`, `X-Frame-Options`, `Referrer-Policy`, etc.).
- RNF-03: Rendimiento orientado a Core Web Vitals.
- RNF-04: Mantenibilidad: documentación viva + backlog priorizado.
- RNF-05: Observabilidad mínima (errores frontend, uptime, analytics).

## 9) Riesgos y decisiones
- Decisión de negocio: dejar expirar `elmst.net`.
- Riesgo técnico/SEO: al expirar el dominio, no se podrán emitir redirecciones 301 desde ese dominio; se perderá parte del equity de enlaces históricos.
- Mitigación parcial: reforzar interlinking, Search Console del nuevo dominio, sitemap actualizado, y actualización manual de enlaces externos críticos.

## 10) Criterios de aceptación de lanzamiento
- Sitio desplegado en Netlify y accesible en `elmst.ibaifernandez.com`.
- Formulario sin PHP funcionando extremo a extremo.
- Robots y sitemap apuntando solo al dominio activo.
- Sin mixed content ni errores críticos en consola.
- Auditoría Lighthouse ejecutada y objetivos mínimos cumplidos o con plan explícito de remediación.
- Plan bilingüe documentado y aprobado; publicación EN condicionada a copy final de negocio.
