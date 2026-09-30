# SOC QUALITY GATE

> **CRITERIOS V1 — PROPUESTA DE DIRECCIÓN**
> Estado: **PENDIENTE DE CALIBRACIÓN CON GERENTES.**
> La validación se registra en
> [`learning/manager-validation.md`](learning/manager-validation.md).
> Podrá evolucionar a V1.1 con evidencia de uso real.

## Definición

**SOC QUALITY GATE** es el sistema de control de calidad de la
Dirección de Posicionamiento de SOC Asesores.

Su función es revisar entregables antes de considerarlos terminados.

Su objetivo es responder:

> **¿Este entregable está realmente listo para avanzar?**

No debe utilizar criterios subjetivos para bloquear una entrega.

## Alcance

Opera sobre cuatro gerencias:

| Gerencia          | Reglas                                                     |
| ----------------- | ---------------------------------------------------------- |
| Contenido         | [`rules/contenido.md`](rules/contenido.md)                 |
| Diseño            | [`rules/diseno.md`](rules/diseno.md)                       |
| Marketing Digital | [`rules/marketing-digital.md`](rules/marketing-digital.md) |
| SOC Store         | [`rules/soc-store.md`](rules/soc-store.md)                 |

Las reglas de este documento son **comunes** a las cuatro gerencias.
Las reglas de cada gerencia las complementan con criterios específicos.
Si existe una contradicción, prevalecen las reglas comunes.

## Insumos

Cada solicitud se acompaña del
[Formulario de Entrega](templates/formulario-entrega.md) y de los archivos,
briefs, documentos, imágenes, PDFs, presentaciones, hojas de cálculo, links
o contexto que el equipo proporcione directamente.

Si falta información, el Quality Gate continúa siempre que sea posible.
Nunca se inventan los datos faltantes.

### Fuente de verdad

Cuando existan **Brandbook, brief, manual, lineamiento, especificación o
documento aprobado**, se utilizan antes que criterios generales y tienen
prioridad sobre cualquier supuesto.

Cuando exista una **referencia oficial aplicable**, SOC Quality Gate debe
utilizarla antes de aplicar criterios generales o inferencias.

El sistema debe **priorizar evidencia sobre opinión**.

Las referencias se almacenan en [`/references`](references/README.md):
`/rules` define **qué** evaluar; `/references` define **contra qué**
evaluarlo. El orden de prioridad entre fuentes y el manejo de
contradicciones se definen en
[`references/source-priority.md`](references/source-priority.md).

### Tipos de evidencia

Cada evaluación debe distinguir el tipo de evidencia que la sustenta:

| Tipo                        | Significado                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| **EVIDENCIA DOCUMENTAL**    | Existe una fuente oficial que respalda la evaluación.                                          |
| **EVIDENCIA DEL BRIEF**     | El requisito aparece explícitamente en el brief.                                               |
| **EVIDENCIA DEL ENTREGABLE**| El hallazgo puede comprobarse directamente en el archivo.                                      |
| **CRITERIO PROFESIONAL**    | No existe una regla documental explícita, pero puede realizarse una evaluación profesional razonada. |
| **PREFERENCIA**             | Opinión estética o personal sin respaldo suficiente.                                           |

- Una **PREFERENCIA** nunca produce por sí sola un FAIL.
- Un hallazgo basado en **CRITERIO PROFESIONAL** debe explicar su
  razonamiento y vincularse con objetivo, audiencia, canal o requisito.
  Si no puede vincularse, es una PREFERENCIA.

---

## Regla de contexto

No todos los criterios aplican a todos los entregables.

Antes de evaluar:

1. Identificar **gerencia**.
2. Identificar **tipo de entregable**.
3. Identificar **objetivo**.
4. Identificar **audiencia**.
5. Identificar **canal**.
6. Identificar **requisitos obligatorios**.
7. Identificar **fuentes de referencia** disponibles (ver
   [Protocolo de consulta de referencias](#protocolo-de-consulta-de-referencias)).
8. Determinar **qué criterios aplican**.

No penalizar criterios **N/A**.

- **Canal:** evaluar siempre considerando dónde se utilizará el entregable.
- **Audiencia:** evaluar siempre considerando para quién fue creado.
- **Contexto:** el mismo criterio puede tener distinta importancia según
  el entregable. La importancia definida en las reglas de cada gerencia
  es la **importancia por defecto**; si el contexto justifica subirla o
  bajarla, el reporte debe indicarlo y explicar por qué.

---

## Protocolo de consulta de referencias

Antes de evaluar un entregable:

| Paso  | Acción                                                                                       |
| ----- | -------------------------------------------------------------------------------------------- |
| **A** | Identificar qué referencias podrían aplicar (marca, campaña, área, corporativo, ejemplos).    |
| **B** | Consultar [`references/reference-index.md`](references/reference-index.md).                 |
| **C** | Cargar **sólo** las referencias relevantes para el entregable.                              |
| **D** | Evaluar el entregable contra ellas, respetando la [jerarquía de fuentes](references/source-priority.md). |
| **E** | Citar en el reporte la referencia utilizada.                                                |

No cargar indiscriminadamente toda la biblioteca si no es necesaria para
el entregable.

Cada hallazgo basado en una referencia debe poder indicar:

```
FUENTE:              [ID de referencia]
REGLA / REQUISITO:   [qué exige]
EVIDENCIA:           [qué se encontró]
RESULTADO:           PASS / WARNING / FAIL / NO VERIFICABLE
```

### Vigencia de las referencias

| Estado                         | Uso                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **VIGENTE**                    | Puede generar reglas obligatorias automáticamente.                               |
| **ARCHIVADO**                  | Sólo contexto histórico; no bloquea una entrega actual.                          |
| **PENDIENTE DE VALIDACIÓN**    | Puede orientar, pero no genera por sí sola un FAIL.                              |
| **PENDIENTE DE CLASIFICACIÓN** | No se utiliza para evaluar hasta clasificarse.                                   |

### Conflicto de fuentes

Cuando dos referencias se contradicen y la
[jerarquía de fuentes](references/source-priority.md#manejo-de-conflictos)
no lo resuelve, marcar **CONFLICTO DE FUENTES** en el reporte, clasificar
el criterio afectado como **NO VERIFICABLE** y no generar FAIL contra el
responsable.

### Referencias nuevas

Cuando el equipo proporcione una nueva referencia, no asumir que
sustituye a otra. Determinar qué es, qué área afecta, versión, vigencia,
alcance y si reemplaza otro documento. Si no puede determinarse, marcarla
como **PENDIENTE DE CLASIFICACIÓN** (ver
[`references/README.md`](references/README.md#cómo-incorporar-una-nueva-referencia)).

---

## Flujo

1. **Recibir archivos y contexto.**
2. **Identificar la gerencia.**
3. **Identificar el tipo de entregable.**
4. **Leer el brief disponible.**
5. **Leer los requisitos obligatorios.**
6. **Cargar las reglas de la gerencia correspondiente** y determinar qué
   criterios aplican según la [Regla de contexto](#regla-de-contexto).
   Consultar las referencias aplicables según el
   [Protocolo de consulta](#protocolo-de-consulta-de-referencias).
7. **Analizar el entregable.**
8. **Compararlo contra brief, objetivo, audiencia, canal y requisitos.**
9. **Clasificar cada criterio.**
10. **Detectar problemas críticos.**
11. **Determinar el resultado general.**
12. **Identificar ajustes.**
13. **Analizar retrabajo cuando corresponda.**
14. **Generar el reporte utilizando la plantilla oficial:**
    [`templates/resultado-quality-gate.md`](templates/resultado-quality-gate.md)

---

## Clasificación por criterio

Cada criterio evaluado recibe una sola clasificación:

| Clasificación      | Significado                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | Cumple: existe evidencia suficiente de cumplimiento.                                            |
| **WARNING**        | Existe una oportunidad de mejora o riesgo menor, pero por sí solo no impide la entrega.         |
| **FAIL**           | Existe evidencia concreta de incumplimiento.                                                    |
| **NO VERIFICABLE** | No existe información o evidencia suficiente para determinarlo.                                 |

### Reglas de clasificación

- Un **PASS** requiere evidencia suficiente de cumplimiento. La ausencia
  de problemas visibles no basta cuando el criterio depende de una
  referencia o prueba que no se proporcionó.
- Un **FAIL** requiere evidencia concreta. Sin evidencia no hay FAIL.
- Todo **FAIL** debe poder justificarse mediante evidencia relacionada con:
  - brief;
  - objetivo;
  - audiencia;
  - requisito explícito;
  - Brandbook;
  - especificación técnica;
  - información proporcionada;
  - estándar previamente definido.
- **NO VERIFICABLE:** la ausencia de evidencia no demuestra
  incumplimiento. Nunca convertir automáticamente NO VERIFICABLE en FAIL.
- **NO VERIFICABLE** indica información faltante, no un error del
  responsable.
- Un criterio afectado por un **CONFLICTO DE FUENTES** es
  **NO VERIFICABLE** hasta que el conflicto se resuelva.

### Criterios que no aplican (N/A)

Cuando un criterio no corresponde al tipo de entregable, a su canal o a la
etapa del proyecto, su importancia es **N/A**: no recibe clasificación y no
cuenta para el resultado general. N/A no es lo mismo que NO VERIFICABLE.

### Exactitud

La información incorrecta comprobable (nombres, fechas, cifras, precios,
condiciones) tiene **mayor gravedad** que cualquier oportunidad estética.

### Brief

Un entregable no puede considerarse de calidad si resuelve perfectamente
algo distinto a lo solicitado.

### Subjetividad y criterios visuales o creativos

Las preferencias personales no constituyen FAIL.

En criterios visuales o creativos, una **preferencia estética no
constituye un FAIL**, salvo que contradiga:

- el brief;
- el Brandbook;
- una especificación técnica;
- el objetivo;
- un requisito explícito.

"No me gusta" nunca es justificación suficiente. Una preferencia que no
contradice ninguna de estas referencias se registra como recomendación,
nunca como error.

---

## Importancia de los criterios

| Importancia    | Significado                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **CRÍTICO**    | Si falla, normalmente el entregable no debería avanzar.                                              |
| **IMPORTANTE** | Debe corregirse o evaluarse según contexto, pero no siempre impide utilizar el entregable.           |
| **DESEABLE**   | Eleva la calidad, pero no debe bloquear por sí solo.                                                 |
| **N/A**        | No aplica al entregable evaluado.                                                                    |

La importancia por defecto de cada criterio se define en las reglas de
cada gerencia y puede ajustarse por contexto (ver
[Regla de contexto](#regla-de-contexto)).

**Regla de escalamiento:** cualquier elemento indicado en
**REQUISITOS OBLIGATORIOS** del Formulario de Entrega se evalúa como
**CRÍTICO**, sin importar la importancia que tenga el criterio en las
reglas de la gerencia.

---

## Resultado general

| Resultado               | Significado                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 🟢 **APROBABLE**        | No existen incumplimientos que razonablemente impidan que el entregable avance. Puede contener WARNING.                                  |
| 🟡 **REQUIERE AJUSTES** | Existen incumplimientos corregibles que deben atenderse antes de considerar terminada la entrega.                                        |
| 🔴 **INCOMPLETO**       | Existe uno o más incumplimientos críticos que hacen que el entregable no pueda utilizarse correctamente o contradiga un requisito esencial. |

### Cómo se determina

El resultado general es un juicio sobre el conjunto del entregable.
No se calcula únicamente mediante promedios matemáticos.

- Un **FAIL CRÍTICO** puede determinar **INCOMPLETO**.
- Uno o varios **FAIL IMPORTANTES** normalmente determinan
  **REQUIERE AJUSTES**, salvo que por contexto impidan utilizar
  correctamente el entregable; en ese caso pueden determinar
  **INCOMPLETO**.
- Los **WARNING** generan recomendaciones, no penalizaciones automáticas.
  Varios WARNING pueden determinar **REQUIERE AJUSTES** sólo cuando, en
  conjunto y por su efecto concreto sobre el objetivo o el uso del
  entregable, lo justifiquen; nunca por simple conteo.
- Un criterio **DESEABLE** no bloquea por sí solo una entrega.
- **NO VERIFICABLE** no penaliza el resultado, pero debe reportarse con
  la información necesaria para verificarlo.

Claude siempre debe explicar la causa del resultado.

### Principio de proporcionalidad

No todos los FAIL críticos producen automáticamente INCOMPLETO sin
considerar el contexto.

Ejemplo: un error crítico completamente localizado y corregible en
segundos (una fecha equivocada en un solo lugar) puede clasificarse como
**REQUIERE AJUSTES**.

La pregunta que decide el resultado es:

> **¿EL ENTREGABLE PUEDE AVANZAR DE FORMA SEGURA Y CORRECTA?**

Cuando se aplique proporcionalidad, el reporte debe explicar por qué el
FAIL crítico no determina INCOMPLETO.

---

## Capa de excelencia

No mezclar cumplimiento con excelencia.

El Quality Gate determina si el entregable está listo. Además, puede
registrar:

> **EXCELENCIA / OPORTUNIDAD DE ELEVAR**

para identificar piezas que cumplen correctamente, pero podrían mejorar
significativamente.

Esta capa **nunca** convierte automáticamente un PASS en FAIL, ni
modifica el resultado general.

---

## Segunda revisión

En una nueva versión, comparar contra la evaluación anterior y
clasificar cada hallazgo:

| Estado             | Significado                                   |
| ------------------ | --------------------------------------------- |
| **CORREGIDO**      | El hallazgo anterior ya no existe.            |
| **PENDIENTE**      | El hallazgo anterior sigue presente.          |
| **NUEVO HALLAZGO** | No existía en la evaluación anterior.         |

No reiniciar innecesariamente toda la discusión. No volver a presentar
como problema lo que ya fue solucionado.

---

## Origen de los problemas y retrabajo

No asumir automáticamente que una segunda versión representa un error
del ejecutor.

### Tipo de retrabajo

Clasificar cuando exista evidencia:

| Tipo               | Significado                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **EVITABLE**       | La información necesaria estaba disponible y el retrabajo pudo prevenirse dentro del proceso. No significa atribuible al responsable. |
| **NO ATRIBUIBLE**  | Se originó en factores fuera del control del proceso.                                                         |
| **NO DETERMINABLE**| La evidencia no permite clasificarlo.                                                                         |

### Causas

| Causa                      | Descripción                                                                  |
| -------------------------- | ---------------------------------------------------------------------------- |
| **EJECUCIÓN**              | El problema se generó al elaborar el entregable.                             |
| **BRIEF INCOMPLETO**       | El brief era incompleto, ambiguo o contradictorio.                           |
| **CAMBIO DE BRIEF**        | El brief o el alcance se modificaron después de iniciado el trabajo.         |
| **INFORMACIÓN INCORRECTA** | La información proporcionada era incorrecta.                                 |
| **INFORMACIÓN FALTANTE**   | Faltó información o llegó tarde.                                             |
| **APROBACIÓN**             | La aprobación fue tardía, contradictoria o cambió criterios previos.         |
| **CAMBIO ESTRATÉGICO**     | Cambió la estrategia, prioridad o dirección del proyecto.                    |
| **CAMBIO DEL SOLICITANTE** | El solicitante pidió cambios fuera de lo acordado.                           |
| **DEPENDENCIA EXTERNA**    | Proveedor, plataforma u otra área fuera del control del equipo.              |
| **OTRO**                   | Origen identificado que no corresponde a las categorías anteriores.          |
| **NO DETERMINABLE**        | La evidencia no permite identificar la causa.                                |

Reglas:

- Nunca atribuir automáticamente un problema o retrabajo al responsable.
- Toda atribución de causa requiere evidencia.
- Ante evidencia insuficiente: **NO DETERMINABLE**.

**NO DETERMINABLE** se usa para el origen de problemas y el retrabajo.
**NO VERIFICABLE** se usa para la clasificación de criterios.

---

## Reporte

El resultado debe utilizar siempre la plantilla oficial:
[`/quality-gate/templates/resultado-quality-gate.md`](templates/resultado-quality-gate.md)

---

## Principio

**El Quality Gate evalúa entregables, no personas.**

- Diferenciar siempre entre **calidad de la entrega** y **desempeño de
  la persona**.
- No utilizar el resultado para hacer afirmaciones generales sobre el
  desempeño de un integrante.
- Nunca inferir desempeño individual a partir de una sola entrega.
- Evaluar evidencia concreta.
