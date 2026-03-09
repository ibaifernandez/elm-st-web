# BACKLOG - elm-st-web

## Leyenda
- Prioridad: P0 (crítico), P1 (alto), P2 (medio), P3 (bajo)
- Estado: TODO, DOING, DONE, BLOCKED

## Plataforma y migración
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| PLAT-001 | P0 | DONE | Configurar `netlify.toml` base | Deploy preview funcional en Netlify |
| PLAT-002 | P0 | DONE | Definir `_redirects` para rutas legacy | No hay 404 en rutas públicas existentes |
| PLAT-003 | P0 | DONE | Definir `_headers` de seguridad | Headers activos en producción |
| PLAT-004 | P0 | DONE | Migrar formulario de `php/submit.php` a solución Netlify | Envío y recepción de mensajes verificados |
| PLAT-005 | P1 | TODO | Configurar dominio `elmst.ibaifernandez.com` en Netlify DNS | Dominio principal resolviendo en Netlify |
| PLAT-006 | P1 | DONE | Añadir CI bloqueante (`quality-gate`) | Pipeline ejecuta checks automatizados |

## SEO
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| SEO-001 | P0 | DONE | Actualizar `robots.txt` al dominio nuevo | `Sitemap:` correcto y rastreable |
| SEO-002 | P0 | DONE | Regenerar `sitemap.xml` con URLs finales | URLs válidas y status 200 |
| SEO-003 | P1 | TODO | Añadir canonical en todas las páginas | 100% páginas con canonical correcto |
| SEO-004 | P1 | DOING | Añadir Open Graph y Twitter cards | Previsualización social consistente |
| SEO-005 | P1 | TODO | Corregir títulos/descripciones duplicadas o débiles | Metadata única por URL indexable |
| SEO-006 | P1 | DOING | Añadir `hreflang` ES/EN cuando esté publicado el bilingüe | Cobertura internacional sin canibalización |

## Accesibilidad
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| A11Y-001 | P0 | DONE | Corregir `alt` vacíos/no existentes en imágenes críticas | 0 `img` sin nombre accesible en rutas principales |
| A11Y-002 | P1 | TODO | Revisar jerarquía de encabezados y landmarks | Estructura semántica válida por página |
| A11Y-003 | P1 | DONE | Etiquetado y validación accesible del formulario | Inputs con nombre accesible y validación activa |
| A11Y-004 | P2 | DOING | Verificar contraste y estados de foco | Cumplimiento WCAG AA en navegación principal |
| A11Y-005 | P1 | DONE | Eliminar rule exception de `color-contrast` en axe | Axe pasa sin exclusiones |

## Rendimiento
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| PERF-001 | P0 | DONE | Comprimir/modernizar imágenes pesadas | Reducción significativa del peso total |
| PERF-002 | P1 | TODO | Eliminar activos residuales (`Thumbs.db`, duplicados) | Repositorio limpio de basura binaria |
| PERF-003 | P1 | DONE | Revisar carga de JS/CSS y `defer` en no críticos | Menor blocking time inicial |
| PERF-004 | P2 | TODO | Definir budget por página | Budget documentado y medible |
| PERF-005 | P0 | DONE | Subir Lighthouse a umbral de CI | `test:lighthouse` pasa en 8 rutas auditadas (ES/EN) |

## Seguridad
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| SEC-001 | P0 | DONE | Eliminar dependencias por `http://` | 0 mixed content |
| SEC-002 | P0 | DONE | Sustituir flujo PHP sin saneado robusto | Validación server-side implementada |
| SEC-003 | P1 | DONE | Revisar enlaces externos `target="_blank"` con `rel` seguro | 100% enlaces externos endurecidos |
| SEC-004 | P1 | TODO | Gestionar API keys expuestas en frontend | Ningún secreto sensible en HTML/JS público |
| SEC-005 | P2 | DONE | Estabilizar checker de enlaces externos ante anti-bot (allowlist) | `test:links` estable en CI con externos habilitados |

## Calidad de código y contenido
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| QLT-001 | P1 | DONE | Corregir errores de marcado HTML detectados | Validación HTML sin errores críticos |
| QLT-002 | P2 | TODO | Unificar copy y geografía de marca (Bogotá/Colombia/Ecuador) | Mensaje consistente en todo el sitio |
| QLT-003 | P2 | DONE | Corregir enlaces rotos/malformados (`https://https://...`) | 0 enlaces malformados |
| QLT-004 | P1 | DONE | Implementar regresión visual baseline | Snapshots versionados y passing |
| QLT-005 | P2 | DONE | Fijar versión de Node para desarrollo local | `.nvmrc` presente y CI alineado |
| QLT-006 | P1 | DONE | Alinear snapshots visuales por plataforma en CI | Baselines `chromium-linux` versionados y `test:visual` estable en GitHub Actions |

## Internacionalización (i18n)
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| I18N-001 | P0 | DONE | Definir estrategia bilingüe ES/EN (rutas, SEO, QA) | Documento de arquitectura i18n aprobado |
| I18N-002 | P0 | DONE | Crear rutas EN equivalentes para páginas públicas | Paridad funcional ES/EN |
| I18N-003 | P0 | DOING | Traducir copy EN aprobado por negocio | 100% contenido público con versión EN |
| I18N-004 | P1 | DOING | QA bilingüe (links, sitemap, hreflang, Lighthouse) | Gate de calidad pasa en ES y EN |
| I18N-005 | P1 | DONE | Exponer selector visible de idioma en navegación | Cambio ES/EN accesible desde header en todas las rutas públicas |

## Observabilidad y documentación
| ID | Prioridad | Estado | Tarea | Criterio de aceptación |
|---|---|---|---|---|
| OBS-001 | P1 | TODO | Migrar tracking UA a GA4 o alternativa | Eventos base verificados en tiempo real |
| OBS-002 | P2 | TODO | Definir panel mínimo de KPIs | Dashboard con tráfico y conversiones |
| DOC-001 | P1 | DONE | Crear y mantener `CHANGELOG.md` | Historial de releases y cambios disponible |
| DOC-002 | P1 | DONE | Mantener `ROADMAP.md` y `BACKLOG.md` al día | Estado real reflejado tras cada iteración |
| DOC-003 | P1 | DONE | Publicar informe de estado por iteración | Resumen técnico + riesgos + resultados de tests por ciclo |
