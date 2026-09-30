<!--
PLANTILLA OFICIAL DE RESULTADO — SOC QUALITY GATE

Instrucciones de uso (no forman parte del reporte):

- Esta es la única plantilla de salida válida para cualquier evaluación.
- Aplicar las reglas comunes de /quality-gate/quality-gate.md y las
  reglas de la gerencia correspondiente en /quality-gate/rules/.
- Conservar todas las secciones y su orden. Si una sección no tiene
  contenido, escribir el texto indicado para ese caso.
- Los comentarios como éste son instrucciones para quien genera el
  reporte y no deben aparecer en el resultado final.
- Evaluar únicamente el entregable. No evaluar a la persona.
-->

# SOC QUALITY GATE

## DATOS DE LA ENTREGA

<!-- Tomar los datos del Formulario de Entrega. Si un dato no fue
proporcionado, escribir "No proporcionado". Nunca inventarlo. -->

**Proyecto:** [Proyecto]
**Gerencia:** [Contenido / Diseño / Marketing Digital / SOC Store]
**Responsable:** [Nombre]
**Solicitante:** [Nombre o área]
**Tipo de entregable:** [Tipo]
**Fecha:** [DD/MM/AAAA]
**Versión:** [Primera entrega / Corrección / Versión final]

---

## RESULTADO GENERAL

<!-- Mostrar ÚNICAMENTE la línea del resultado correspondiente y borrar
las otras dos:

🟢 APROBABLE
🟡 REQUIERE AJUSTES
🔴 INCOMPLETO

Debajo, explicar en una o dos líneas la causa del resultado. -->

[🟢 APROBABLE | 🟡 REQUIERE AJUSTES | 🔴 INCOMPLETO]

**Causa:** [Explicación concreta de por qué se asigna este resultado.]

---

## RESUMEN EJECUTIVO

<!-- Máximo 5 líneas. Explicar:
- qué se evaluó;
- nivel general de calidad;
- principales hallazgos;
- qué impide avanzar, si existe algo. -->

[Resumen]

---

## QUALITY SCORECARD

<!-- Una fila por criterio de la gerencia correspondiente.

Importancia permitida: CRÍTICO / IMPORTANTE / DESEABLE.
Si un criterio es requisito obligatorio del formulario, su importancia
es CRÍTICO (regla de escalamiento).

Resultado permitido: PASS / WARNING / FAIL / NO VERIFICABLE.

Evidencia / Observación: cita, ubicación y referencia contra la que se
comparó. Todo FAIL debe tener evidencia concreta. -->

| Criterio | Importancia | Resultado | Evidencia / Observación |
|---|---|---|---|
| [Criterio] | [CRÍTICO / IMPORTANTE / DESEABLE] | [PASS / WARNING / FAIL / NO VERIFICABLE] | [Evidencia] |

<!-- Los criterios que no corresponden al tipo de entregable o a su etapa
no se incluyen en la tabla: se listan aquí y no cuentan para el
resultado. Si todos aplican, escribir "Todos los criterios aplican." -->

**Criterios que no aplican:** [Criterio — motivo]

---

## DEBE CORREGIRSE

<!-- Exclusivamente incumplimientos reales que impiden o condicionan la
aprobación: FAIL en criterios CRÍTICOS o IMPORTANTES.

No incluir preferencias subjetivas, WARNING ni NO VERIFICABLE.
Un FAIL en un criterio DESEABLE no bloquea por sí solo: se registra en
RECOMENDAMOS MEJORAR.

Ordenar de mayor a menor importancia.
Si no existen, escribir: "Ninguna corrección obligatoria." -->

### 1. [Criterio]

**Problema:** [Qué incumple.]
**Evidencia:** [Cita, ubicación y referencia contra la que se comparó.]
**Por qué importa:** [Efecto sobre el objetivo, la audiencia, la marca o el uso del entregable.]
**Corrección requerida:** [Acción concreta.]

---

## RECOMENDAMOS MEJORAR

<!-- Oportunidades de mejora que no bloquean la entrega: WARNING, FAIL en
criterios DESEABLES y sugerencias.

No mezclarlas con errores. Cada recomendación debe explicar el
beneficio concreto del cambio.
Si no existen, escribir: "Sin recomendaciones adicionales." -->

- **[Criterio]:** [Recomendación y beneficio concreto.]

---

## NO VERIFICABLE

<!-- Criterios que no pudieron comprobarse y qué información sería
necesaria para verificarlos.

NO VERIFICABLE nunca equivale automáticamente a FAIL y no se atribuye
como error al responsable.
Si no existen, escribir: "Todos los criterios pudieron verificarse." -->

| Criterio | Información necesaria para verificarlo |
|---|---|
| [Criterio] | [Documento, dato o evidencia faltante] |

---

## RETRABAJO

<!-- Se analiza cuando la versión es Corrección o Versión final, o cuando
el contexto indica versiones previas. En una Primera entrega sin
antecedentes, responder NO.

Nunca atribuir automáticamente el retrabajo al responsable.
Si no hay evidencia suficiente, usar NO DETERMINABLE. -->

**¿Existe?:** [SÍ / NO / NO DETERMINABLE]

<!-- Completar lo siguiente sólo si la respuesta es SÍ. -->

**Tipo:** [EVITABLE / NO ATRIBUIBLE / NO DETERMINABLE]

<!--
EVITABLE: la información necesaria estaba disponible y el retrabajo
pudo prevenirse dentro del proceso. EVITABLE no significa atribuible
al responsable: puede originarse en el brief, la aprobación o el
solicitante.
NO ATRIBUIBLE: se originó en factores fuera del control del proceso
(cambio estratégico, dependencia externa, cambio de alcance posterior).
NO DETERMINABLE: la evidencia no permite clasificarlo.
-->

**Causa probable:** [EJECUCIÓN / BRIEF / CAMBIO DE BRIEF / CAMBIO DE ALCANCE / INFORMACIÓN / APROBACIÓN / CAMBIO ESTRATÉGICO / SOLICITANTE / DEPENDENCIA EXTERNA / OTRO]

**Evidencia:** [Qué documentos, versiones o comunicaciones sustentan la clasificación.]

---

## PARA APROBAR

<!-- Lista concreta y priorizada de los cambios necesarios para convertir
el entregable en APROBABLE. Empezar por los CRÍTICOS.

Cada acción debe ser específica y ejecutable. Evitar:
"mejorar diseño", "revisar copy", "dar seguimiento".
Preferir: "Corregir la fecha del evento de X a Y según el brief."

Incluir también la información que debe proporcionarse para resolver
los NO VERIFICABLE que impidan confirmar la aprobación.

Si el resultado ya es APROBABLE, escribir:
"No se requieren cambios para aprobar." -->

1. [Acción específica y ejecutable.]
2. [Acción específica y ejecutable.]

---

## SEGUNDA REVISIÓN

<!-- Sólo cuando es una versión posterior y se cuenta con la evaluación
anterior. Comparar cada hallazgo previo:

CORREGIDO: el hallazgo anterior ya no existe.
PENDIENTE: el hallazgo anterior sigue presente.
NUEVO HALLAZGO: no existía en la evaluación anterior.

No volver a presentar como problema lo que ya fue solucionado: los
hallazgos CORREGIDOS no se repiten en DEBE CORREGIRSE.

Si es Primera entrega, escribir: "No aplica: primera entrega."
Si es versión posterior pero no se proporcionó la evaluación anterior,
escribir: "No verificable: no se proporcionó la evaluación anterior." -->

| Hallazgo | Evaluación anterior | Estado actual |
|---|---|---|
| [Hallazgo] | [PASS / WARNING / FAIL / NO VERIFICABLE] | [CORREGIDO / PENDIENTE / NUEVO HALLAZGO] |

---

## DICTAMEN FINAL

**ESTADO:** [APROBABLE / REQUIERE AJUSTES / INCOMPLETO]

**SIGUIENTE ACCIÓN:** [Acción concreta.]

---

*Este dictamen evalúa únicamente el entregable. No constituye una
evaluación del desempeño de ninguna persona.*
