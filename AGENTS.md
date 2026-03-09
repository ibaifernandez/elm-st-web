# AGENTS - Guía de trabajo para agentes en elm-st-web

## 1) Misión
Mejorar y operar `elm-st-web` con criterio de producto: calidad técnica alta, cambios pequeños y verificables, y foco en migración profesional a Netlify.

## 2) Documentación que manda
Antes de cualquier cambio, revisar:
1. `PRD.md`
2. `ARCHITECTURE.md`
3. `ROADMAP.md`
4. `BACKLOG.md`
5. `IA-RULES.md`
6. `CHANGELOG.md`
7. `I18N-STRATEGY.md`

## 3) Reglas operativas
- Trabajar siempre contra tareas trazables del backlog.
- No introducir cambios de arquitectura sin actualizar `ARCHITECTURE.md`.
- No introducir deuda técnica "temporal" sin fecha de retiro.
- No mezclar refactor masivo con cambios funcionales en el mismo lote.
- Priorizar P0/P1 antes que tareas cosméticas.
- Respetar `visual/copy freeze` salvo instruccion expresa.

## 4) Estándares mínimos por cambio
- Accesibilidad: no degradar navegación por teclado ni semántica.
- SEO: mantener o mejorar metadata y estructura indexable.
- Performance: evitar aumentar peso de carga sin justificación.
- Seguridad: no exponer secretos, usar prácticas seguras en formularios/enlaces.

## 5) Protocolo de entrega
Cada entrega debe incluir:
- Qué se cambió.
- Qué riesgo se mitigó o qué objetivo se cumple.
- Qué validaciones se ejecutaron.
- Qué queda pendiente.
- Actualización de `CHANGELOG.md` cuando aplique.

## 6) Convenciones de alcance
- Fase migración: estabilidad > reescritura total.
- Fase optimización: calidad medible > cambios subjetivos.
- Fase evolución: nuevas capacidades solo si mejoran KPIs.
- Fase bilingüe: paridad funcional ES/EN sin degradar SEO ni UX.
