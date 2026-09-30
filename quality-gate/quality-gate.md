# SOC QUALITY GATE

## Definición

**SOC QUALITY GATE** es el sistema de control de calidad de la
Dirección de Posicionamiento de SOC Asesores.

Su función es revisar entregables antes de considerarlos terminados.

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

### Fuentes de referencia

Cuando exista una fuente de referencia proporcionada (Brandbook, brief,
manual, lineamiento, especificación), ésta tendrá **prioridad sobre
supuestos generales**.

El sistema debe **priorizar evidencia sobre opinión**.

---

## Flujo

1. **Recibir archivos y contexto.**
2. **Identificar la gerencia.**
3. **Identificar el tipo de entregable.**
4. **Leer el brief disponible.**
5. **Leer los requisitos obligatorios.**
6. **Cargar las reglas de la gerencia correspondiente.**
7. **Analizar el entregable.**
8. **Compararlo contra brief, objetivo, audiencia y requisitos.**
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
| **PASS**           | Cumple correctamente: existe evidencia suficiente de cumplimiento.                              |
| **WARNING**        | Existe una oportunidad de mejora o riesgo menor, pero por sí solo no impide la entrega.         |
| **FAIL**           | Existe evidencia concreta de incumplimiento.                                                    |
| **NO VERIFICABLE** | No existe información o evidencia suficiente para determinarlo.                                 |

### Reglas de clasificación

- Un **PASS** requiere evidencia suficiente de cumplimiento. La ausencia
  de problemas visibles no basta cuando el criterio depende de una
  referencia o prueba que no se proporcionó.
- Un **FAIL** requiere evidencia concreta. Sin evidencia no hay FAIL.
- Nunca convertir automáticamente **NO VERIFICABLE** en **FAIL**.
- **NO VERIFICABLE** indica información faltante, no un error del
  responsable.

### Criterios que no aplican

Cuando un criterio no corresponde al tipo de entregable o a la etapa del
proyecto, se registra como **No aplica**: no recibe clasificación y no
cuenta para el resultado general. No aplicar no es lo mismo que
NO VERIFICABLE.

### Criterios visuales o creativos

En criterios visuales o creativos, una **preferencia estética no
constituye un FAIL**, salvo que contradiga:

- el brief;
- el Brandbook;
- una especificación técnica;
- el objetivo;
- un requisito explícito.

Una preferencia que no contradice ninguna de estas referencias se
registra como recomendación, nunca como error.

---

## Importancia de los criterios

Todo criterio debe poder clasificarse por su importancia:

| Importancia    | Significado                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------- |
| **CRÍTICO**    | Si falla, el entregable no puede considerarse terminado. Un FAIL puede determinar INCOMPLETO. |
| **IMPORTANTE** | Afecta la calidad o efectividad. Debe corregirse antes de avanzar.                           |
| **DESEABLE**   | Mejora el entregable, pero no bloquea por sí solo una entrega.                               |

La importancia de cada criterio se define en las reglas de cada gerencia.

**Regla de escalamiento:** cualquier elemento indicado en
**REQUISITOS OBLIGATORIOS** del Formulario de Entrega se evalúa como
**CRÍTICO**, sin importar la importancia que tenga el criterio en las
reglas de la gerencia.

---

## Resultado general

| Resultado            | Significado                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| **APROBABLE**        | El entregable puede avanzar.                                                     |
| **REQUIERE AJUSTES** | Existen correcciones que deben realizarse antes de avanzar.                      |
| **INCOMPLETO**       | Existe un problema crítico que impide considerar terminado el entregable.        |

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

---

## Origen de los problemas y retrabajo

Cuando se identifica un problema o un retrabajo, se debe diferenciar su
origen:

| Origen                 | Descripción                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| **EJECUCIÓN**          | El problema se generó al elaborar el entregable.                         |
| **BRIEF**              | El brief era incompleto, ambiguo o contradictorio.                       |
| **CAMBIO DE BRIEF**    | El brief se modificó después de iniciado el trabajo.                     |
| **CAMBIO DE ALCANCE**  | Se agregaron o modificaron entregables, cantidades o requisitos.         |
| **INFORMACIÓN**        | Faltó información, llegó tarde o era incorrecta.                         |
| **APROBACIÓN**         | La aprobación fue tardía, contradictoria o cambió criterios previos.     |
| **CAMBIO ESTRATÉGICO** | Cambió la estrategia, prioridad o dirección del proyecto.                |
| **SOLICITANTE**        | El solicitante pidió cambios fuera de lo acordado.                       |
| **DEPENDENCIA EXTERNA**| Proveedor, plataforma u otra área fuera del control del equipo.          |
| **OTRO**               | Origen identificado que no corresponde a las categorías anteriores.      |

Reglas:

- Nunca atribuir automáticamente un problema o retrabajo al responsable.
- Toda atribución de origen requiere evidencia.
- Ante evidencia insuficiente, el origen es **NO DETERMINABLE**.

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
