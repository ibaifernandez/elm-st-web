# ROADMAP - elm-st-web

## Estado a 11 marzo 2026
- Estrategia: `visual/copy freeze` activo.
- Estado global: migracion a Netlify muy avanzada, hardening tecnico estabilizado.
- Quality gate: `quality:ci` con hardening anti-flake (Lighthouse `numberOfRuns=3` + budgets por ruta).
- Bilingue ES/EN: rutas EN publicadas en modo operativo; QA de tono en curso.
- Selector de idioma: migrado a patron flotante (`pelotita` inferior izquierda) con fallback en navegacion legacy.
- Formulario: Turnstile invisible activo y envio operativo via `/.netlify/functions/submit-contact` + Resend.
- Dossier tecnico: publicado en ES/EN, trazado en sitemap y reforzado con visor modal de documentacion fuente.
- Avance por fases de excelencia:
  - Fase 1 ("robusto por dentro"): `100%` (captcha, observabilidad, uptime, envio transaccional y quality gate semanal).
  - Fase 2 ("pruebas de ingenieria visibles"): `100%` (budgets por ruta + reporte tecnico versionado + CI semanal).
  - Fase 3 ("portfolio vibe coder"): `90%` (dossier publicado y mejorado; pendiente cierre manual de gobernanza en GitHub/Sentry y QA manual final).

## Horizonte
Plan de 10 semanas (marzo a mayo de 2026), con entregas incrementales.

## Plan operativo accionable (11 marzo 2026 -> 11 abril 2026)
### Bloque 1 - Cerrar antispam y seguridad de formulario
Periodo: 10 marzo 2026 - 12 marzo 2026
- Estado: `HECHO`.
- Implementacion (Codex):
  - Verificado en produccion el flujo `runtime-config` + `verify-turnstile`.
  - Turnstile serverless activo en ES/EN.
  - Desacoplado el submit de Netlify Forms por bloqueo de plataforma (`POST /` 404) y migrado a `/.netlify/functions/submit-contact`.
  - Persistencia de mensajes habilitada en logs de funcion y entrega por Resend activada en produccion.
- Necesito de ti:
  - Ningun bloqueo tecnico abierto en este bloque.
- Entregable:
  - Formulario operativo con captcha invisible activo y sin regresion visual/copy.

### Bloque 2 - Observabilidad y uptime
Periodo: 13 marzo 2026 - 17 marzo 2026
- Estado: `PARCIAL` (instrumentacion hecha; pendiente afinado de alertas P1/P2 en Sentry).
- Implementacion (Codex):
  - Integrada captura de errores frontend con Sentry JS por runtime config.
  - Monitor HTTP externo creado en UptimeRobot para `elmst.ibaifernandez.com`.
  - Publicado runbook de alertas/incidentes `ALERTING.md` con matriz P1/P2/P3.
- Necesito de ti:
  - Crear reglas P1/P2 en Sentry segun `ALERTING.md` (UptimeRobot ya activo con correo confirmado).
- Entregable:
  - Deteccion automatica de caidas y errores JS criticos.

### Bloque 3 - Automatizacion de consistencia
Periodo: 18 marzo 2026 - 21 marzo 2026
- Estado: `PARCIAL`.
- Implementacion (Codex):
  - Workflow semanal `Quality Gate` activo (`schedule`: lunes 13:00 UTC, checkout sobre `codex`).
  - QA manual estructurada con CSV (`qa-desktop.csv`, `qa-mobile.csv`); falta formalizar issue mensual automático.
  - Definir policy de merge: sin `quality:ci` verde no entra nada.
- Necesito de ti:
  - Reordenar ramas (`main`->`legacy`, `codex`->`main`) y activar branch protection sobre la nueva `main`.
- Entregable:
  - Operacion recurrente automatizada + control manual mensual trazable.

### Bloque 4 - Pruebas de ingenieria visibles
Periodo: 24 marzo 2026 - 28 marzo 2026
- Estado: `HECHO`.
- Implementacion (Codex):
  - Budgets por ruta implementados en `performance-budgets.json` + `test:budgets`.
  - Script de reporte tecnico por release implementado: `npm run report:release`.
  - Consolidar dashboard tecnico minimo en documentacion.
- Necesito de ti:
  - Validar formato final de reporte para futuras entregas mensuales.
- Entregable:
  - Evidencia objetiva de calidad tecnica por release.

### Bloque 5 - Dossier tecnico "vibe coder"
Periodo: 31 marzo 2026 - 4 abril 2026
- Estado: `PARCIAL` (publicado y reforzado visualmente; pendiente cierre de QA manual y tono final).
- Implementacion (Codex):
  - Pagina tecnica publicada: `dossier-tecnico.html` y `en/technical-dossier.html`.
  - Mejoras de UX: CTA de menu en dos lineas, objetivo al inicio, grid estable y modal para documentacion fuente.
  - Mantener look&feel actual, sin romper freeze de homepage principal.
  - Añadir metadata y trazabilidad de cambios.
- Necesito de ti:
  - Aprobar tono de marca ES/EN.
- Entregable:
  - Activo de portfolio tecnico listo para entrevistas y propuestas.

### Bloque 6 - Riesgo SEO por expiracion de `elmst.net`
Periodo: 7 abril 2026 - 11 abril 2026
- Estado: `CERRADO` por decision de negocio (dominio no se renueva).
- Implementacion (Codex):
  - Riesgo SEO residual documentado y aceptado.
  - Sitio operativo orientado a portfolio tecnico, sin estrategia de retencion de equity en `elmst.net`.
- Necesito de ti:
  - Ninguna accion adicional sobre `elmst.net`.
- Entregable:
  - Riesgo SEO documentado como decision consciente de producto/negocio.

## Fase 0 - Fundacion (completada)
Periodo: 7 marzo 2026
- Auditoria inicial del repositorio y deuda tecnica.
- Documentacion base creada: `PRD.md`, `IA-RULES.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `BACKLOG.md`, `AGENTS.md`, `README.md`.

Exit criteria:
- Gobierno del proyecto definido y versionado.

## Fase 1 - Migracion segura a Netlify (completada)
Periodo: 7 marzo 2026 - 14 marzo 2026
- Infra de Netlify: `netlify.toml`, `_redirects`, `_headers`, `index.html`, `404.html`.
- Formulario migrado de PHP a Netlify Functions compatible con sitio estatico.
- Pipeline CI bloqueante con tests de calidad.
- Dominio productivo operativo `elmst.ibaifernandez.com`.

Exit criteria:
- Deploy funcional en Netlify.
- Contacto operativo sin backend PHP.
- Rutas publicas resueltas sin 404 criticos.

## Fase 2 - Hardening tecnico (completada)
Periodo: 10 marzo 2026 - 6 abril 2026
- SEO tecnico: canonical, OG/Twitter, metadata unica por pagina.
- Accesibilidad: cierre de gaps serios y eliminacion de excepciones en axe.
- Performance: optimizacion de imagenes y carga de JS/CSS no critico.
- Seguridad: hardening de enlaces, headers, mixed content, secretos.
- Seguridad formulario: verificacion serverless de captcha Turnstile activa con claves productivas.

Exit criteria:
- `quality:ci` en verde. (cumplido en esta iteracion)
- Lighthouse por ruta critica: Performance >= 90, Accessibility >= 95, SEO >= 95, Best Practices >= 95.

## Fase 3 - Bilingue ES/EN y dossier tecnico (en curso)
Periodo: 24 marzo 2026 - 20 abril 2026
- Implementar arquitectura i18n para sitio estatico (`/` y `/en/`). (completado)
- Publicar rutas EN equivalentes para todas las paginas publicas. (completado)
- Añadir `hreflang` y sitemap bilingue. (completado)
- Ejecutar QA completo en ES y EN (links, a11y, visual, lighthouse). (completado)
- Dossier tecnico ES/EN publicado y medido por quality gate.

Exit criteria:
- Paridad funcional y SEO entre ES y EN.
- Sin regresiones visuales respecto al freeze.
- Curado final de tono de marca y decision de visibilidad del dossier.

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
