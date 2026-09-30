# Jerarquía de fuentes

Define qué fuente prevalece cuando varias aplican a un mismo entregable,
y cómo actuar cuando entran en conflicto.

> **Principio de fuente de verdad:** cuando exista una referencia oficial
> aplicable, SOC Quality Gate debe utilizarla antes de aplicar criterios
> generales o inferencias.

---

## Alcance de la jerarquía

La jerarquía ordena **requisitos**: qué debe cumplir el entregable.

No modifica la **metodología** definida en
[`quality-gate.md`](../quality-gate.md) (clasificación, NO VERIFICABLE,
resultado general, proporcionalidad, evaluación de entregables y no de
personas). Esas reglas aplican siempre, sin importar la fuente.

---

## Niveles

| Nivel | Fuente                                       | Ejemplos                                                                                                          | Uso                                                                                  |
| ----- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **1** | **Requisito específico aprobado**            | Brief aprobado, instrucción explícita del proyecto, especificación técnica, requisito contractual, información oficial proporcionada para la pieza. | Cuando es aplicable al proyecto, tiene máxima prioridad.                             |
| **2** | **Identidad y lineamientos oficiales SOC**   | Brandbook vigente, manuales oficiales, sistemas visuales, guías de tono, lineamientos corporativos.               | Base obligatoria de marca para todo entregable que use la marca SOC.                |
| **3** | **Campaña vigente**                          | Concepto rector, key visual, claims, CTA, mensajes aprobados, paleta específica, sistema gráfico, audiencias, restricciones. | Obligatoria para piezas de esa campaña. No se aplica a otras campañas sin evidencia. |
| **4** | **Reglas especializadas de Quality Gate**    | [Contenido](../rules/contenido.md), [Diseño](../rules/diseno.md), [Marketing Digital](../rules/marketing-digital.md), [SOC Store](../rules/soc-store.md). | Definen qué criterios revisar y con qué evidencia clasificarlos.                     |
| **5** | **Ejemplos aprobados**                       | Piezas en [`approved-examples/`](approved-examples/) y en `/examples` de cada área.                              | Referencia de calidad y consistencia. **No** se convierten automáticamente en reglas obligatorias. |
| **6** | **Criterio profesional**                     | Evaluación razonada sin regla documental explícita.                                                               | Sólo cuando las fuentes anteriores no resuelven el punto.                            |

### Condiciones de uso

- Sólo las fuentes con estado **VIGENTE** generan requisitos obligatorios.
- Una fuente **ARCHIVADA** sólo aporta contexto histórico y nunca bloquea
  una entrega actual.
- Una fuente **PENDIENTE DE VALIDACIÓN** puede orientar, pero no genera
  por sí sola un FAIL.
- Un **ejemplo aprobado** (nivel 5) nunca sustenta por sí solo un FAIL.
- El **criterio profesional** (nivel 6) debe explicar su razonamiento y
  vincularse con objetivo, audiencia, canal o requisito. Si no puede
  vincularse, es una **preferencia** y nunca produce FAIL.

---

## Manejo de conflictos

Cuando dos fuentes entren en conflicto:

### A. Específica vs. general

Determinar si una fuente es específica del proyecto y la otra es general.

La fuente específica aprobada puede prevalecer sobre la general **cuando
exista una excepción explícita** (por ejemplo, el brief indica
expresamente que la pieza usará una paleta distinta y esa excepción fue
aprobada).

Sin excepción explícita, la contradicción entre un brief y un
lineamiento oficial es un **CONFLICTO DE FUENTES**.

### B. Vigencia

Una versión **vigente** prevalece sobre una **archivada**.

Si no es posible determinar cuál es la versión vigente, es un
**CONFLICTO DE FUENTES**.

### C. No suponer

No resolver contradicciones importantes mediante suposición.

Cuando exista conflicto real, marcar **CONFLICTO DE FUENTES** e indicar:

| Campo                  | Contenido                                                     |
| ---------------------- | ------------------------------------------------------------- |
| **Fuente A**           | ID y documento.                                               |
| **Fuente B**           | ID y documento.                                               |
| **Conflicto detectado**| Qué dice cada una.                                            |
| **Impacto**            | Qué criterios o elementos del entregable afecta.              |
| **Decisión necesaria** | Qué debe definir Dirección, el solicitante o el dueño de la fuente. |

**No generar FAIL contra el responsable cuando el problema provenga de
referencias contradictorias.** El criterio afectado se clasifica como
**NO VERIFICABLE** hasta que se resuelva el conflicto.
