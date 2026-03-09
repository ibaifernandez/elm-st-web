# IA-RULES - Reglas para Agentes de IA

## 1) Propósito
Estas reglas aseguran que cualquier agente de IA contribuya al proyecto con calidad profesional, sin introducir deuda técnica ni cambios opacos.

## 2) Documentos fuente obligatorios
Antes de proponer o ejecutar cambios, leer:
1. `PRD.md`
2. `ARCHITECTURE.md`
3. `ROADMAP.md`
4. `BACKLOG.md`
5. `AGENTS.md`
6. `CHANGELOG.md`
7. `I18N-STRATEGY.md`

Si hay conflicto, prevalece este orden.

## 3) Reglas de ejecución
- No hacer cambios masivos sin justificar impacto.
- No introducir frameworks nuevos sin registrar la decisión en `ARCHITECTURE.md`.
- No tocar copy comercial sustantivo sin ticket específico.
- Respetar freeze visual/copy salvo instrucción explícita de negocio.
- No romper compatibilidad de rutas públicas sin plan de redirects.
- No usar dependencias sin revisar mantenimiento y seguridad.

## 4) Reglas de calidad
- Accesibilidad primero: HTML semántico, labels correctos, foco visible, navegación por teclado.
- SEO técnico primero: titles/meta/canonical/OG coherentes por página.
- Seguridad por defecto: saneado de inputs, validación en servidor, protección de secretos.
- Rendimiento por defecto: imágenes optimizadas, scripts mínimos, carga diferida donde aplique.

## 5) Flujo mínimo por tarea
1. Entender objetivo y criterios de aceptación.
2. Revisar impacto técnico (arquitectura + riesgos).
3. Implementar en pequeño y verificable.
4. Validar (lint/test/build/auditoría aplicable).
5. Documentar cambios y actualizar backlog/roadmap/changelog si procede.

## 6) Definition of Done
Una tarea está terminada solo si:
- Cumple criterio funcional.
- No degrada SEO, accesibilidad, rendimiento ni seguridad.
- Incluye evidencia de validación.
- Deja documentación actualizada cuando cambian reglas o arquitectura.
- Mantiene trazabilidad de cambios en `CHANGELOG.md`.

## 7) Formato de reporte esperado de la IA
- Objetivo de la tarea.
- Archivos tocados.
- Riesgos/decisiones.
- Verificaciones realizadas.
- Próximos pasos sugeridos.
