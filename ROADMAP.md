# ROADMAP - elm-st-web

## Estado a 10 marzo 2026
- Estrategia: `visual/copy freeze` activo.
- Estado global: migracion a Netlify muy avanzada, hardening tecnico estabilizado.
- Quality gate: `quality:ci` en verde (lint, links, e2e, a11y, visual, Lighthouse).
- Bilingue ES/EN: rutas EN publicadas en modo operativo; QA de tono en curso.
- Selector de idioma: migrado a patron flotante (`pelotita` inferior izquierda) con fallback en navegacion legacy.
- Formulario: Turnstile invisible activo y envío operativo vía `/.netlify/functions/submit-contact`.

## Horizonte
Plan de 10 semanas (marzo a mayo de 2026), con entregas incrementales.

## Plan operativo accionable (10 marzo 2026 -> 11 abril 2026)
### Bloque 1 - Cerrar antispam y seguridad de formulario
Periodo: 10 marzo 2026 - 12 marzo 2026
- Implementacion (Codex):
  - Verificado en produccion el flujo `runtime-config` + `verify-turnstile`.
  - Turnstile serverless activo en ES/EN.
  - Desacoplado el submit de Netlify Forms por bloqueo de plataforma (`POST /` 404) y migrado a `/.netlify/functions/submit-contact`.
  - Persistencia de mensajes habilitada en Netlify Blobs con opción de entrega por Resend.
- Necesito de ti:
  - Validar un envío manual ES y otro EN desde producción.
  - (Opcional) Definir `RESEND_API_KEY` + `CONTACT_TO_EMAIL` para notificación por email.
- Entregable:
  - Formulario operativo con captcha invisible activo y sin regresion visual/copy.

### Bloque 2 - Observabilidad y uptime
Periodo: 13 marzo 2026 - 17 marzo 2026
- Implementacion (Codex):
  - Integrada captura de errores frontend con Sentry JS por runtime config.
  - Monitor HTTP externo creado en UptimeRobot para `elmst.ibaifernandez.com`.
  - Pendiente: checklist final de alarmas y runbook de incidentes P1.
- Necesito de ti:
  - Confirmar canal de alerta primario (email/SMS) y destinatarios.
  - Confirmar severidad para notificaciones de Sentry (error/fatal).
- Entregable:
  - Deteccion automatica de caidas y errores JS criticos.

### Bloque 3 - Automatizacion de consistencia
Periodo: 18 marzo 2026 - 21 marzo 2026
- Implementacion (Codex):
  - Programar workflow semanal `Quality Gate` en GitHub Actions (`schedule`).
  - Crear issue template y rutina mensual para QA manual (`qa-desktop.csv`, `qa-mobile.csv`).
  - Definir policy de merge: sin `quality:ci` verde no entra nada.
- Necesito de ti:
  - Confirmar dia/hora de ejecucion semanal (zona horaria America/Bogota).
  - Confirmar rama objetivo (`codex` o `main`) para checks programados.
  - Activar branch protection en GitHub.
- Entregable:
  - Operacion recurrente automatizada + control manual mensual trazable.

### Bloque 4 - Pruebas de ingenieria visibles
Periodo: 24 marzo 2026 - 28 marzo 2026
- Implementacion (Codex):
  - Definir budgets por ruta (peso, LCP proxy, score minimo por categoria).
  - Añadir reporte tecnico de release versionado por fecha.
  - Consolidar dashboard tecnico minimo en documentacion.
- Necesito de ti:
  - Aprobacion de umbrales (estrictos o conservadores) para budgets.
  - Aprobacion del formato final de reporte.
- Entregable:
  - Evidencia objetiva de calidad tecnica por release.

### Bloque 5 - Dossier tecnico "vibe coder"
Periodo: 31 marzo 2026 - 4 abril 2026
- Implementacion (Codex):
  - Crear pagina tecnica del proyecto (arquitectura, CI, seguridad, i18n, lighthouse, automatizaciones).
  - Mantener look&feel actual, sin romper freeze de homepage principal.
  - Añadir metadata y trazabilidad de cambios.
- Necesito de ti:
  - Aprobar tono de marca ES/EN.
  - Definir si el enlace al dossier va visible en navegacion o solo URL directa.
- Entregable:
  - Activo de portfolio tecnico listo para entrevistas y propuestas.

### Bloque 6 - Riesgo SEO por expiracion de `elmst.net`
Periodo: 7 abril 2026 - 11 abril 2026
- Implementacion (Codex):
  - Plan de mitigacion SEO: inventario de backlinks criticos + outreach de actualizacion.
  - Checklist Search Console/Bing para consolidar `elmst.ibaifernandez.com`.
  - Seguimiento de cobertura e indexacion post-migracion.
- Necesito de ti:
  - Confirmacion final de negocio: mantener o no `elmst.net` 6-12 meses.
  - Acceso/Search Console del dominio nuevo.
- Entregable:
  - Riesgo SEO documentado y mitigado con acciones concretas.

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
- Seguridad formulario: verificacion serverless de captcha Turnstile activa con claves productivas.

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
