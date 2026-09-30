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

**ID de revisión:** [QG-AAAA-NNNN]
**Revisión anterior:** [QG-AAAA-NNNN / "—" si es la primera]
**Criterios aplicados:** [V1]

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

Debajo, explicar en una o dos líneas la causa del resultado.
Si se aplicó el principio de proporcionalidad (un FAIL CRÍTICO que no
determina INCOMPLETO), explicar por qué el entregable puede avanzar de
forma segura y correcta tras la corrección. -->

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

Importancia permitida: CRÍTICO / IMPORTANTE / DESEABLE / N/A.
Usar la importancia por defecto de las reglas de la gerencia. Si un
criterio es requisito obligatorio del formulario, su importancia es
CRÍTICO (regla de escalamiento). Si el contexto justifica otro ajuste,
explicarlo en la columna de evidencia.

Resultado permitido: PASS / WARNING / FAIL / NO VERIFICABLE.
Los criterios con importancia N/A no reciben resultado: usar "—" y
anotar brevemente por qué no aplican. No se penalizan.

Evidencia / Observación: cita, ubicación y referencia contra la que se
comparó. Todo FAIL debe tener evidencia concreta. Cuando el hallazgo se
base en una referencia, indicar "FUENTE: REF-XXXX-000". -->

| Criterio | Importancia | Resultado | Evidencia / Observación |
|---|---|---|---|
| [Criterio] | [CRÍTICO / IMPORTANTE / DESEABLE] | [PASS / WARNING / FAIL / NO VERIFICABLE] | [Evidencia] |
| [Criterio] | N/A | — | [Motivo por el que no aplica] |

---

## DEBE CORREGIRSE

<!-- Exclusivamente incumplimientos reales que impiden o condicionan la
aprobación: FAIL en criterios CRÍTICOS o IMPORTANTES.

No incluir preferencias subjetivas, WARNING ni NO VERIFICABLE.
Una PREFERENCIA nunca es un incumplimiento.
Un FAIL en un criterio DESEABLE no bloquea por sí solo: se registra en
RECOMENDAMOS MEJORAR.

Ordenar de mayor a menor importancia.
Si no existen, escribir: "Ninguna corrección obligatoria." -->

### 1. [Criterio]

**Problema:** [Qué incumple.]
**Fuente:** [REF-XXXX-000 — o "Brief", "Entregable" si no hay referencia registrada]
**Regla / requisito:** [Qué exige la fuente.]
**Tipo de evidencia:** [EVIDENCIA DOCUMENTAL / EVIDENCIA DEL BRIEF / EVIDENCIA DEL ENTREGABLE / CRITERIO PROFESIONAL]
**Evidencia:** [Cita, ubicación y qué se encontró.]
**Por qué importa:** [Efecto sobre el objetivo, la audiencia, la marca o el uso del entregable.]
**Corrección requerida:** [Acción concreta.]

---

## RECOMENDAMOS MEJORAR

<!-- Oportunidades de mejora que no bloquean la entrega: WARNING, FAIL en
criterios DESEABLES y recomendaciones derivadas de preferencias que no
contradicen ninguna referencia.

No mezclarlas con errores. Cada recomendación debe explicar el
beneficio concreto del cambio.
Si no existen, escribir: "Sin recomendaciones adicionales." -->

- **[Criterio]:** [Recomendación y beneficio concreto.]

---

## EXCELENCIA / OPORTUNIDAD DE ELEVAR

<!-- Opcional. Para entregables que cumplen correctamente, pero podrían
mejorar significativamente (por ejemplo, originalidad, sofisticación
visual, capacidad persuasiva).

Esta sección NO modifica el resultado general y nunca convierte un PASS
en FAIL. No mezclarla con cumplimiento.
Si no hay oportunidades relevantes, escribir: "Sin observaciones de
excelencia." -->

- [Oportunidad concreta y cómo elevaría el entregable.]

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

## CONFLICTOS DE FUENTES

<!-- Contradicciones entre referencias que la jerarquía de fuentes no
resuelve (ver /quality-gate/references/source-priority.md).

El criterio afectado se clasifica como NO VERIFICABLE. Nunca generar
FAIL contra el responsable por referencias contradictorias.
Si no existen, escribir: "Sin conflictos de fuentes." -->

**Fuente A:** [ID — documento]
**Fuente B:** [ID — documento]
**Conflicto detectado:** [Qué dice cada una.]
**Impacto:** [Criterios o elementos afectados.]
**Decisión necesaria:** [Qué debe definirse y quién debe hacerlo.]

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
(cambio estratégico, dependencia externa, cambio de brief o de alcance
posterior).
NO DETERMINABLE: la evidencia no permite clasificarlo.
-->

**Causa probable:** [EJECUCIÓN / BRIEF INCOMPLETO / CAMBIO DE BRIEF / INFORMACIÓN INCORRECTA / INFORMACIÓN FALTANTE / APROBACIÓN / CAMBIO ESTRATÉGICO / CAMBIO DEL SOLICITANTE / DEPENDENCIA EXTERNA / OTRO / NO DETERMINABLE]

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
hallazgos CORREGIDOS no se repiten en DEBE CORREGIRSE. No reiniciar
innecesariamente toda la discusión.

Si es Primera entrega, escribir: "N/A: primera entrega."
Si es versión posterior pero no se proporcionó la evaluación anterior,
escribir: "No verificable: no se proporcionó la evaluación anterior." -->

| Hallazgo | Evaluación anterior | Estado actual |
|---|---|---|
| [Hallazgo] | [PASS / WARNING / FAIL / NO VERIFICABLE] | [CORREGIDO / PENDIENTE / NUEVO HALLAZGO] |

---

## FUENTES CONSULTADAS

<!-- Referencias de /quality-gate/references utilizadas en esta
evaluación, según reference-index.md. Incluir sólo las que se
consultaron realmente. Indicar también brief y otros documentos
proporcionados para la pieza.
Si no se consultó ninguna referencia registrada, escribir:
"Sin referencias registradas consultadas; evaluación basada en brief,
entregable y reglas de la gerencia." -->

| ID | Documento | Versión | Aplicación |
|---|---|---|---|
| [REF-XXXX-000] | [Nombre del documento] | [Versión o "No especificado"] | [Criterios en los que se utilizó] |

---

## DICTAMEN FINAL

**ESTADO:** [APROBABLE / REQUIERE AJUSTES / INCOMPLETO]

**SIGUIENTE ACCIÓN:** [Acción concreta.]

---

*Este dictamen evalúa únicamente el entregable. No constituye una
evaluación del desempeño de ninguna persona.*
