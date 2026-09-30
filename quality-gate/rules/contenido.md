# Reglas — Contenido

> **SOC QUALITY GATE — CRITERIOS V1 — PROPUESTA DE DIRECCIÓN**
> Estado: **PENDIENTE DE CALIBRACIÓN CON GERENTES.**

Reglas del Quality Gate para entregables de la Gerencia de Contenido:
copys, guiones, artículos, posts, carruseles, newsletters, emails,
presentaciones, documentos y cualquier pieza cuyo valor principal sea el texto.

Estas reglas se aplican dentro del flujo y las reglas comunes definidas en
[`quality-gate.md`](../quality-gate.md): clasificación, importancia, N/A,
regla de escalamiento, resultado general y proporcionalidad.

---

## Cómo usar estas reglas

1. Aplicar la [Regla de contexto](../quality-gate.md#regla-de-contexto)
   y determinar qué criterios aplican. Los que no aplican son **N/A**.
2. Evaluar cada criterio aplicable: **PASS**, **WARNING**, **FAIL** o
   **NO VERIFICABLE**.
3. Registrar la **evidencia** que sustenta la clasificación.
4. Usar la importancia por defecto de cada criterio, salvo que el
   contexto justifique ajustarla (explicarlo en el reporte).

### Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Cita textual** del fragmento evaluado.
- **Ubicación** en el entregable (slide, párrafo, línea, minuto, página,
  pieza del carrusel).
- **Referencia** contra la que se compara (brief, objetivo, requisito,
  fuente del dato, lineamiento).

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia para comparar, el criterio es **NO VERIFICABLE**
y se indica qué información hizo falta.

### Versiones posteriores

La comparación contra versiones anteriores se realiza en la
[Segunda revisión](../quality-gate.md#segunda-revisión), no como criterio
de esta lista.

---

## Resumen de criterios

| #  | Criterio                       | Importancia por defecto |
| -- | ------------------------------ | ----------------------- |
| 1  | Cumplimiento del brief         | CRÍTICO                 |
| 2  | Exactitud de información       | CRÍTICO                 |
| 3  | Objetivo de comunicación       | CRÍTICO                 |
| 4  | Ortografía y gramática         | CRÍTICO                 |
| 5  | Mensaje principal              | IMPORTANTE              |
| 6  | Audiencia                      | IMPORTANTE              |
| 7  | Tono SOC                       | IMPORTANTE              |
| 8  | CTA                            | IMPORTANTE (condicional)|
| 9  | Coherencia de campaña          | IMPORTANTE (condicional)|
| 10 | Claridad                       | IMPORTANTE              |
| 11 | SEO                            | IMPORTANTE (condicional)|
| 12 | Formato y extensión            | IMPORTANTE              |
| 13 | Capacidad persuasiva           | DESEABLE (condicional)  |
| 14 | Originalidad                   | DESEABLE                |

**Condicional:** el criterio sólo aplica en los casos indicados en su
ficha; en los demás es N/A.

---

## CRÍTICOS

### 1. Cumplimiento del brief — CRÍTICO

**Qué se revisa:** que el contenido responda a lo solicitado en el brief:
tema, alcance, entregables pedidos, indicaciones y restricciones.

**Referencia:** brief.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Cada indicación del brief tiene correspondencia identificable en el entregable.                       |
| **WARNING**        | Se cumple el brief, pero alguna indicación secundaria se atiende de forma parcial o poco evidente.    |
| **FAIL**           | El contenido contradice, omite o se desvía de un requisito esencial del brief. Citar la indicación y el fragmento. |
| **NO VERIFICABLE** | No se proporcionó brief.                                                                              |

### 2. Exactitud de información — CRÍTICO

**Qué se revisa:** nombres, cargos, fechas, lugares, cifras, productos,
condiciones, datos y cualquier afirmación verificable; su fuente y su
vigencia.

**Referencia:** brief, documentación oficial o fuentes proporcionadas.

| Clasificación      | Evidencia                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **PASS**           | La información coincide con las fuentes disponibles y está vigente.                                          |
| **WARNING**        | La información es correcta, pero hay generalizaciones que podrían malinterpretarse o falta indicar fuente, fecha de corte o condiciones cuando conviene. |
| **FAIL**           | Existe información incorrecta respecto a las fuentes disponibles, inconsistente dentro del entregable o vencida. Citar la afirmación y la fuente. |
| **NO VERIFICABLE** | No existe fuente suficiente para comprobarla. Listar cada dato o afirmación pendiente de validar.           |

### 3. Objetivo de comunicación — CRÍTICO

**Qué se revisa:** que el contenido responda al propósito para el que fue
creado: informar, posicionar, convertir, invitar, explicar, educar,
generar registro, generar consideración u otro declarado.

**Referencia:** campo OBJETIVO del formulario o brief.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | Mensaje, estructura y cierre conducen al objetivo declarado.                                 |
| **WARNING**        | El objetivo se atiende, pero hay elementos que distraen o lo debilitan.                      |
| **FAIL**           | El mensaje no permite cumplir razonablemente el objetivo principal.                          |
| **NO VERIFICABLE** | No se indicó objetivo ni en el formulario ni en el brief.                                    |

### 4. Ortografía y gramática — CRÍTICO

**Qué se revisa:** acentuación, mayúsculas, puntuación, escritura de
nombres propios y marcas, concordancia, sintaxis y conjugación.

**Referencia:** normas de la lengua española y nombres oficiales de
productos, marcas y personas.

No deben llegar errores evidentes a publicación.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | No se detectan errores ortográficos ni gramaticales.                                                    |
| **WARNING**        | Detalles estilísticos o mejoras de redacción que no constituyen errores. Citar cada uno.               |
| **FAIL**           | Errores claros que afectan una entrega final. Listar cada error con su ubicación.                       |
| **NO VERIFICABLE** | El texto no es legible o no se proporcionó en un formato revisable.                                     |

---

## IMPORTANTES

### 5. Mensaje principal — IMPORTANTE

**Qué se revisa:** que exista un mensaje principal identificable y
comprensible, y que sea el que el brief pide comunicar.

**Referencia:** brief u objetivo.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | El mensaje principal se identifica con claridad y coincide con el solicitado.                      |
| **WARNING**        | El mensaje existe, pero compite con mensajes secundarios o aparece tarde.                          |
| **FAIL**           | No hay un mensaje principal identificable o contradice el solicitado.                              |
| **NO VERIFICABLE** | No se definió mensaje principal en el brief. Aun así, registrar cuál es el mensaje que se percibe. |

### 6. Audiencia — IMPORTANTE

**Qué se revisa:** que el lenguaje, la profundidad, el argumento y el CTA
correspondan al receptor definido.

**Referencia:** campo AUDIENCIA del formulario o brief.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Lenguaje, profundidad, argumentos y CTA son pertinentes para la audiencia indicada.              |
| **WARNING**        | Hay fragmentos con tecnicismos, supuestos o referencias poco adecuados para la audiencia.        |
| **FAIL**           | El contenido está claramente dirigido a otra audiencia o resulta inadecuado para la indicada.    |
| **NO VERIFICABLE** | No se indicó audiencia.                                                                          |

### 7. Tono SOC — IMPORTANTE

**Aplica cuando:** el entregable corresponde a la marca SOC.

**Qué se revisa:** consistencia con la personalidad y la narrativa de
SOC: voz, tono y terminología.

**Referencia:** lineamientos de marca SOC vigentes e indicaciones de tono
del brief.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Voz, tono y terminología son consistentes con los lineamientos de marca.                           |
| **WARNING**        | Hay expresiones aisladas fuera de tono o terminología no preferida. Citar el fragmento.           |
| **FAIL**           | El tono general contradice los lineamientos o se usan términos que la marca no permite.            |
| **NO VERIFICABLE** | No se dispone de los lineamientos aplicables para comparar.                                        |

### 8. CTA — IMPORTANTE (condicional)

**Aplica cuando:** el objetivo requiere una acción.

**N/A cuando:** el entregable es puramente informativo o el brief no
requiere acción. No penalizar la ausencia de CTA en estos casos.

**Qué se revisa:** que la llamada a la acción sea clara, esté alineada al
objetivo y tenga los datos correctos (liga, teléfono, registro).

**Referencia:** objetivo, brief y requisitos obligatorios.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | El CTA es claro, visible, coherente con el objetivo y sus datos son correctos.                 |
| **WARNING**        | El CTA existe, pero es débil, genérico o poco visible.                                         |
| **FAIL**           | Falta el CTA que el objetivo o el brief requieren, contradice el objetivo o contiene datos incorrectos. |
| **NO VERIFICABLE** | No es posible comprobar la liga o el dato de contacto.                                         |

### 9. Coherencia de campaña — IMPORTANTE (condicional)

**Aplica cuando:** la pieza pertenece a una campaña. Si no, es N/A.

**Qué se revisa:** que el contenido no contradiga otros mensajes, claims,
promesas o información de la campaña, ni su concepto o etapa.

**Referencia:** brief de campaña, piezas previas o lineamientos de campaña.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El contenido es consistente con los mensajes, claims y promesas de la campaña.                   |
| **WARNING**        | Hay variaciones de terminología o enfoque respecto a la campaña.                                 |
| **FAIL**           | El contenido contradice un mensaje, claim, promesa o dato de la campaña. Citar ambos.            |
| **NO VERIFICABLE** | No se proporcionó información de la campaña.                                                     |

### 10. Claridad — IMPORTANTE

**Qué se revisa:** que el texto se entienda a la primera lectura y que la
información esté ordenada. Evitar ambigüedad, redundancia innecesaria,
frases difíciles de comprender e información desordenada.

**Referencia:** el propio entregable, su audiencia y, si existe, la
estructura pedida en el brief.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Las ideas se entienden sin relectura y siguen un orden lógico.                                    |
| **WARNING**        | Hay frases largas, redundantes, saltos o repeticiones que convendría ajustar. Citar los fragmentos. |
| **FAIL**           | Hay fragmentos ambiguos que admiten interpretaciones distintas, que no se entienden, o un orden que impide seguir el contenido o incumple la estructura exigida en el brief. |
| **NO VERIFICABLE** | El texto no es legible o el entregable está incompleto.                                           |

### 11. SEO — IMPORTANTE (condicional)

**Aplica exclusivamente cuando:** el contenido está destinado a buscadores
(web, blog, landing) o el brief lo solicita. En los demás casos es N/A.

**Qué se revisa, según contexto:** intención de búsqueda, keyword
principal, estructura, metadata, encabezados, legibilidad, enlazado y
utilidad del contenido.

**Referencia:** keywords y requisitos SEO del brief.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Los elementos SEO aplicables están presentes y bien aplicados.                                   |
| **WARNING**        | Hay elementos SEO ausentes o mejorables que no fueron exigidos.                                  |
| **FAIL**           | Faltan elementos SEO exigidos en el brief o el contenido no responde a la intención de búsqueda definida. |
| **NO VERIFICABLE** | El contenido requiere SEO, pero no se indicaron keyword ni requisitos.                           |

### 12. Formato y extensión — IMPORTANTE

**Qué se revisa:** que el formato y la longitud correspondan al canal y
al requerimiento: tipo de archivo, estructura por pieza, límites de
caracteres, hashtags, menciones, subtítulos, extensión solicitada.

**Referencia:** campos CANAL y TIPO DE ENTREGABLE del formulario, brief y
especificaciones del canal.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Formato y extensión corresponden al canal y al requerimiento.                                      |
| **WARNING**        | Hay detalles de formato mejorables, o el texto es notablemente más largo o corto de lo conveniente, sin incumplir un límite. |
| **FAIL**           | El formato impide usar el entregable en el canal, o excede o no alcanza un límite exigido. Indicar límite y extensión actual. |
| **NO VERIFICABLE** | No se indicó el canal ni las especificaciones o límites.                                           |

---

## DESEABLES

### 13. Capacidad persuasiva — DESEABLE (condicional)

**Aplica cuando:** el objetivo requiere generar interés o movimiento
(convertir, invitar, generar registro o consideración). En los demás
casos es N/A.

**Qué se revisa:** si el contenido genera interés y motiva la acción
esperada: beneficio claro, relevancia para la audiencia, argumento.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | El contenido presenta un beneficio o motivo claro para la audiencia.                           |
| **WARNING**        | El beneficio es débil, genérico o aparece tarde. Explicar el efecto concreto.                  |
| **FAIL**           | Sólo cuando contradice un requisito explícito del brief sobre el enfoque persuasivo. Por sí solo no bloquea. |
| **NO VERIFICABLE** | No se indicó objetivo ni audiencia para valorarlo.                                             |

### 14. Originalidad — DESEABLE

**Qué se revisa:** lenguaje excesivamente genérico, intercambiable con
cualquier otra marca o carente de diferenciación.

**Nunca bloquear una entrega exclusivamente por originalidad.**

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | El contenido tiene elementos propios de SOC y no es intercambiable.                               |
| **WARNING**        | Hay frases genéricas o de uso común que podrían aplicar a cualquier marca. Citarlas.             |
| **FAIL**           | No se usa por originalidad. Un problema de originalidad se registra como WARNING o en la capa de excelencia. |
| **NO VERIFICABLE** | El texto no es legible o el entregable está incompleto.                                           |
