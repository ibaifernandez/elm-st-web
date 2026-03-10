# ALERTING RUNBOOK - elm-st-web

## Objetivo
Definir una politica operativa unica para alertas de errores frontend y caida de disponibilidad.

## Herramientas
- Errores frontend: Sentry (proyecto `elmst`, entorno `production`).
- Disponibilidad: UptimeRobot (monitor HTTP sobre `https://elmst.ibaifernandez.com`).

## Severidades
- `P1`:
  - Uptime down (2 checks consecutivos fallidos).
  - Error frontend `fatal` o `error` con >= 10 eventos en 10 minutos.
- `P2`:
  - Degradacion intermitente (up/down breve o timeout repetido).
  - Error frontend `error` con >= 3 eventos en 30 minutos.
- `P3`:
  - Warning no bloqueante, ruido puntual o issue sin impacto de usuario.

## Canales recomendados
- P1: email inmediato + push mobile.
- P2: email agrupado cada 15 minutos.
- P3: revision diaria en dashboard (sin interrupcion inmediata).

## Configuracion minima requerida
### Sentry
- Alert Rule 1 (`P1`):
  - Condition: `event.level in [error, fatal]`
  - Threshold: `>= 10 events / 10 minutes`
  - Environment: `production`
  - Action: enviar email a owner principal.
- Alert Rule 2 (`P2`):
  - Condition: `event.level = error`
  - Threshold: `>= 3 events / 30 minutes`
  - Environment: `production`
  - Action: email agrupado.

### UptimeRobot
- Tipo: HTTP monitor.
- URL: `https://elmst.ibaifernandez.com`.
- Intervalo: 5 minutos.
- Timeout: 30 segundos.
- SSL monitoring: activo.
- Notificacion: email inmediato en DOWN + email en RECOVERY.

## Procedimiento de incidente
1. Confirmar incidencia en monitor (evitar falso positivo aislado).
2. Revisar ultimo deploy en Netlify y ultimo commit en `codex`.
3. Revisar Sentry por fingerprint y alcance.
4. Si afecta al formulario/contacto: probar `/.netlify/functions/submit-contact`.
5. Abrir issue con plantilla de incidente y registrar fecha/hora UTC y America/Bogota.
6. Aplicar fix en `codex`, ejecutar `quality:ci`, desplegar y cerrar incidente con postmortem breve.

## Verificacion mensual
- Revisar destinatarios de alertas y correo activo.
- Validar que Sentry sigue recibiendo eventos de smoke.
- Validar que UptimeRobot envia alerta de prueba (maintenance window controlada).
