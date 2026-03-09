# ROADMAP - elm-st-web

## Estado a 8 marzo 2026
- Estrategia: `visual/copy freeze` activo.
- Estado global: migracion a Netlify muy avanzada, hardening tecnico estabilizado.
- Quality gate: `quality:ci` en verde (lint, links, e2e, a11y, visual, Lighthouse).
- Bilingue ES/EN: rutas EN publicadas en modo operativo; QA de tono en curso.

## Horizonte
Plan de 10 semanas (marzo a mayo de 2026), con entregas incrementales.

## Fase 0 - Fundacion (completada)
Periodo: 7 marzo 2026
- Auditoria inicial del repositorio y deuda tecnica.
- Documentacion base creada: `PRD.md`, `IA-RULES.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `BACKLOG.md`, `AGENTS.md`, `README.md`.

Exit criteria:
- Gobierno del proyecto definido y versionado.

## Fase 1 - Migracion segura a Netlify (practicamente completada)
Periodo: 7 marzo 2026 - 14 marzo 2026
- Infra de Netlify: `netlify.toml`, `_redirects`, `_headers`, `index.html`, `404.html`.
- Formulario migrado de PHP a Netlify Forms compatible con sitio estatico.
- Pipeline CI bloqueante con tests de calidad.
- Pendiente de cierre: configuracion DNS final y verificacion de dominio `elmst.ibaifernandez.com`.

Exit criteria:
- Deploy funcional en Netlify.
- Contacto operativo sin backend PHP.
- Rutas publicas resueltas sin 404 criticos.

## Fase 2 - Hardening tecnico (en curso)
Periodo: 10 marzo 2026 - 6 abril 2026
- SEO tecnico: canonical, OG/Twitter, metadata unica por pagina.
- Accesibilidad: cierre de gaps serios y eliminacion de excepciones en axe.
- Performance: optimizacion de imagenes y carga de JS/CSS no critico.
- Seguridad: hardening de enlaces, headers, mixed content, secretos.

Exit criteria:
- `quality:ci` en verde. (cumplido en esta iteracion)
- Lighthouse por ruta critica: Performance >= 90, Accessibility >= 95, SEO >= 95, Best Practices >= 95.

## Fase 3 - Bilingue ES/EN (iniciada)
Periodo: 24 marzo 2026 - 20 abril 2026
- Implementar arquitectura i18n para sitio estatico (`/` y `/en/`).
- Publicar rutas EN equivalentes para todas las paginas publicas.
- Añadir `hreflang` y sitemap bilingue.
- Ejecutar QA completo en ES y EN (links, a11y, visual, lighthouse).

Exit criteria:
- Paridad funcional y SEO entre ES y EN.
- Sin regresiones visuales respecto al freeze.

## Fase 4 - Lanzamiento y estabilizacion
Periodo: 21 abril 2026 - 4 mayo 2026
- Go-live de `elmst.ibaifernandez.com`.
- Monitoreo post-lanzamiento (errores, formularios, metricas clave).
- Correcciones rapidas de incidencias P1/P2.

Exit criteria:
- 7 dias sin incidentes P1.
- Documentacion operativa y changelog actualizados.

## Fase 5 - Evolucion continua
Periodo: desde 5 mayo 2026
- Iteraciones de conversion y contenidos.
- Instrumentacion de analitica y panel minimo de KPIs.
- Evaluacion de modernizacion profunda de stack solo si mejora ROI.
