# Reglas — Contenido

Reglas del Quality Gate para entregables de la Gerencia de Contenido:
copys, guiones, artículos, posts, carruseles, newsletters, emails,
presentaciones, documentos y cualquier pieza cuyo valor principal sea el texto.

Estas reglas se aplican dentro del flujo definido en
[`quality-gate.md`](../quality-gate.md).

---

## Cómo usar estas reglas

1. Evaluar cada criterio de la lista.
2. Asignar una clasificación: **PASS**, **WARNING**, **FAIL** o
   **NO VERIFICABLE**.
3. Registrar la **evidencia** que sustenta la clasificación.
4. Considerar la **prioridad** del criterio (CRÍTICO, IMPORTANTE o DESEABLE)
   para determinar el resultado general.

### Prioridades

| Prioridad      | Significado                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------- |
| **CRÍTICO**    | Si falla, el entregable no puede considerarse terminado. Un FAIL puede determinar INCOMPLETO. |
| **IMPORTANTE** | Afecta la calidad o efectividad. Debe corregirse antes de avanzar.                           |
| **DESEABLE**   | Mejora el entregable, pero no impide que avance.                                             |

### Regla de escalamiento

Cualquier elemento indicado en **REQUISITOS OBLIGATORIOS** del
[Formulario de Entrega](../templates/formulario-entrega.md) se evalúa como
**CRÍTICO**, sin importar la prioridad que tenga el criterio en esta tabla.

### Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Cita textual** del fragmento evaluado.
- **Ubicación** en el entregable (slide, párrafo, línea, minuto, página,
  pieza del carrusel).
- **Referencia** contra la que se compara (brief, objetivo, requisito,
  versión anterior, fuente del dato).

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia para comparar, el criterio es **NO VERIFICABLE**
y se indica qué información hizo falta.

### Criterios que no aplican

Cuando un criterio no aplica al tipo de entregable (por ejemplo, SEO en una
pieza impresa, o consistencia entre versiones en una primera entrega), se
registra como **No aplica** y no se considera en el resultado general.
No aplicar no es lo mismo que NO VERIFICABLE.

---

## Resumen de criterios

| #  | Criterio                       | Prioridad  |
| -- | ------------------------------ | ---------- |
| 1  | Cumplimiento del brief         | CRÍTICO    |
| 2  | Objetivo                       | CRÍTICO    |
| 3  | Audiencia                      | IMPORTANTE |
| 4  | Mensaje principal              | CRÍTICO    |
| 5  | Claridad                       | IMPORTANTE |
| 6  | Estructura                     | IMPORTANTE |
| 7  | Tono SOC                       | IMPORTANTE |
| 8  | Ortografía                     | IMPORTANTE |
| 9  | Gramática                      | IMPORTANTE |
| 10 | Exactitud                      | CRÍTICO    |
| 11 | Datos y cifras                 | CRÍTICO    |
| 12 | CTA                            | IMPORTANTE |
| 13 | Coherencia con campaña         | IMPORTANTE |
| 14 | SEO (cuando aplique)           | DESEABLE   |
| 15 | Formato                        | IMPORTANTE |
| 16 | Extensión                      | DESEABLE   |
| 17 | Consistencia entre versiones   | IMPORTANTE |

---

## Criterios

### 1. Cumplimiento del brief — CRÍTICO

**Qué se revisa:** que el entregable responda a lo solicitado en el brief:
tema, alcance, entregables pedidos, indicaciones y restricciones.

**Referencia:** brief.

| Clasificación      | Evidencia                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | Cada indicación del brief tiene correspondencia identificable en el entregable.                 |
| **WARNING**        | Se cumple el brief, pero alguna indicación se atiende de forma parcial o poco evidente.         |
| **FAIL**           | Una indicación explícita del brief no se atiende o se contradice. Citar la indicación y el fragmento. |
| **NO VERIFICABLE** | No se proporcionó brief.                                                                        |

### 2. Objetivo — CRÍTICO

**Qué se revisa:** que el contenido esté orientado a conseguir el objetivo
declarado (informar, generar registro, posicionar, convertir, etc.).

**Referencia:** campo OBJETIVO del formulario o brief.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | El mensaje, la estructura y el CTA conducen al objetivo declarado.                           |
| **WARNING**        | El objetivo se atiende, pero hay elementos que distraen o lo debilitan.                      |
| **FAIL**           | El contenido persigue un objetivo distinto o no contribuye al declarado.                     |
| **NO VERIFICABLE** | No se indicó objetivo ni en el formulario ni en el brief.                                    |

### 3. Audiencia — IMPORTANTE

**Qué se revisa:** que el lenguaje, nivel de detalle, ejemplos y
beneficios correspondan a la audiencia indicada.

**Referencia:** campo AUDIENCIA del formulario o brief.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Vocabulario, ejemplos y beneficios son pertinentes para la audiencia indicada.                     |
| **WARNING**        | Hay fragmentos con tecnicismos, supuestos o referencias poco adecuados para la audiencia.          |
| **FAIL**           | El contenido está claramente dirigido a otra audiencia o resulta inadecuado para la indicada.      |
| **NO VERIFICABLE** | No se indicó audiencia.                                                                            |

### 4. Mensaje principal — CRÍTICO

**Qué se revisa:** que exista un mensaje principal identificable y que
sea el que el brief pide comunicar.

**Referencia:** brief u objetivo.

| Clasificación      | Evidencia                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | El mensaje principal se identifica con claridad y coincide con el solicitado.                   |
| **WARNING**        | El mensaje existe, pero compite con mensajes secundarios o aparece tarde.                       |
| **FAIL**           | No hay un mensaje principal identificable o contradice el solicitado.                           |
| **NO VERIFICABLE** | No se definió mensaje principal en el brief. Aun así, registrar cuál es el mensaje que se percibe. |

### 5. Claridad — IMPORTANTE

**Qué se revisa:** que el texto se entienda a la primera lectura, sin
ambigüedades ni frases confusas.

**Referencia:** el propio entregable y su audiencia.

| Clasificación      | Evidencia                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **PASS**           | Las ideas se entienden sin relectura.                                                       |
| **WARNING**        | Hay frases largas, redundantes o que requieren relectura. Citar los fragmentos.            |
| **FAIL**           | Hay fragmentos ambiguos que admiten interpretaciones distintas o que no se entienden.      |
| **NO VERIFICABLE** | El texto no es legible en el archivo proporcionado (resolución, formato, archivo dañado).   |

### 6. Estructura — IMPORTANTE

**Qué se revisa:** orden lógico, jerarquía de ideas, títulos,
secuencia de slides o piezas y cierre.

**Referencia:** el propio entregable y, si existe, la estructura pedida en el brief.

| Clasificación      | Evidencia                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **PASS**           | La secuencia es lógica y respeta la estructura solicitada, si la hay.                      |
| **WARNING**        | Hay saltos, repeticiones o elementos que convendría reordenar.                             |
| **FAIL**           | La estructura impide seguir el contenido o no respeta la estructura exigida en el brief.   |
| **NO VERIFICABLE** | El entregable está incompleto o no se proporcionaron todas sus partes.                     |

### 7. Tono SOC — IMPORTANTE

**Qué se revisa:** que la voz, el tono y la terminología correspondan a
los lineamientos de marca de SOC Asesores.

**Referencia:** lineamientos de marca SOC vigentes y, si existen,
indicaciones de tono del brief.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Voz, tono y terminología son consistentes con los lineamientos de marca.                            |
| **WARNING**        | Hay expresiones aisladas fuera de tono o terminología no preferida. Citar el fragmento.            |
| **FAIL**           | El tono general contradice los lineamientos o se usan términos que la marca no permite.             |
| **NO VERIFICABLE** | No se dispone de los lineamientos aplicables para comparar.                                         |

### 8. Ortografía — IMPORTANTE

**Qué se revisa:** acentuación, uso de mayúsculas, puntuación y
escritura correcta de palabras, nombres propios y marcas.

**Referencia:** normas de la lengua española y nombres oficiales de
productos, marcas y personas.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | No se detectan errores ortográficos.                                                                   |
| **WARNING**        | Hay errores menores aislados en texto secundario. Listar cada uno con su ubicación.                    |
| **FAIL**           | Hay errores en títulos, nombres de marca o producto, datos de contacto, o errores recurrentes.         |
| **NO VERIFICABLE** | El texto no es legible o no se proporcionó en un formato revisable.                                    |

### 9. Gramática — IMPORTANTE

**Qué se revisa:** concordancia, sintaxis, conjugación, uso de
preposiciones y construcción de frases.

**Referencia:** normas de la lengua española.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | No se detectan errores gramaticales.                                                         |
| **WARNING**        | Hay construcciones mejorables o errores menores aislados. Citar cada uno.                    |
| **FAIL**           | Hay errores que alteran el sentido del mensaje o que son recurrentes.                        |
| **NO VERIFICABLE** | El texto no es legible o no se proporcionó en un formato revisable.                          |

### 10. Exactitud — CRÍTICO

**Qué se revisa:** que las afirmaciones sobre productos, servicios,
procesos, condiciones, fechas, nombres y hechos sean correctas.

**Referencia:** brief, documentación oficial o fuentes proporcionadas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Las afirmaciones coinciden con la referencia proporcionada.                                             |
| **WARNING**        | Hay afirmaciones imprecisas o generalizaciones que podrían malinterpretarse.                            |
| **FAIL**           | Una afirmación contradice la referencia proporcionada. Citar la afirmación y la referencia.            |
| **NO VERIFICABLE** | No se proporcionó referencia para comprobar la afirmación. Listar las afirmaciones pendientes de validar. |

### 11. Datos y cifras — CRÍTICO

**Qué se revisa:** montos, tasas, porcentajes, plazos, estadísticas,
fechas y cualquier dato cuantitativo; su fuente y su vigencia.

**Referencia:** fuente del dato proporcionada por el equipo.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Cada dato coincide con su fuente y está vigente.                                                   |
| **WARNING**        | El dato es correcto, pero falta indicar fuente, fecha de corte o condiciones cuando conviene.     |
| **FAIL**           | Un dato no coincide con su fuente, es inconsistente dentro del entregable o está vencido.          |
| **NO VERIFICABLE** | No se proporcionó la fuente. Listar cada dato sin fuente.                                          |

### 12. CTA — IMPORTANTE

**Qué se revisa:** que exista una llamada a la acción clara, alineada al
objetivo y con los datos correctos (liga, teléfono, registro, etc.).

**Referencia:** objetivo, brief y requisitos obligatorios.

| Clasificación      | Evidencia                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | El CTA es claro, visible, coherente con el objetivo y sus datos son correctos.                  |
| **WARNING**        | El CTA existe, pero es débil, genérico o poco visible.                                          |
| **FAIL**           | Falta el CTA requerido, contradice el objetivo o contiene datos incorrectos.                    |
| **NO VERIFICABLE** | No se indicó qué CTA se esperaba, o no se puede comprobar la liga o dato de contacto.           |

### 13. Coherencia con campaña — IMPORTANTE

**Qué se revisa:** que el contenido sea consistente con la campaña a la
que pertenece: concepto, mensajes, etapa, terminología y piezas relacionadas.

**Referencia:** brief de campaña, piezas previas o lineamientos de la campaña.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | El contenido es consistente con el concepto y los mensajes de la campaña.                      |
| **WARNING**        | Hay variaciones de terminología o enfoque respecto a la campaña.                               |
| **FAIL**           | El contenido contradice el concepto, los mensajes o la etapa de la campaña.                    |
| **NO VERIFICABLE** | No se proporcionó información de la campaña. Si la pieza no pertenece a una campaña: No aplica. |

### 14. SEO (cuando aplique) — DESEABLE

**Aplica a:** contenido web, blog, landing pages y otros textos
destinados a buscadores.

**Qué se revisa:** palabra clave, título, metadescripción, encabezados,
URL y enlaces, según lo solicitado.

**Referencia:** palabras clave y requisitos SEO del brief.

| Clasificación      | Evidencia                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **PASS**           | Los elementos SEO solicitados están presentes y bien aplicados.                             |
| **WARNING**        | Hay elementos SEO ausentes o mejorables.                                                    |
| **FAIL**           | Faltan elementos SEO exigidos en el brief o se contradicen.                                 |
| **NO VERIFICABLE** | El contenido requiere SEO, pero no se indicaron palabras clave ni requisitos.               |

### 15. Formato — IMPORTANTE

**Qué se revisa:** que el entregable cumpla con el formato del canal y
del tipo de pieza: tipo de archivo, estructura por pieza, límites de
caracteres, hashtags, menciones, subtítulos, etc.

**Referencia:** campo CANAL y TIPO DE ENTREGABLE del formulario, brief y
especificaciones del canal.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | El formato corresponde al canal y tipo de entregable indicados.                              |
| **WARNING**        | Hay detalles de formato mejorables que no impiden su uso.                                    |
| **FAIL**           | El formato impide usar el entregable en el canal indicado o incumple una especificación exigida. |
| **NO VERIFICABLE** | No se indicó el canal ni las especificaciones de formato.                                    |

### 16. Extensión — DESEABLE

**Qué se revisa:** que la longitud sea adecuada al canal, formato y
audiencia, o la solicitada en el brief.

**Referencia:** brief y especificaciones del canal.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | La extensión es adecuada o coincide con la solicitada.                                           |
| **WARNING**        | El texto es notablemente más largo o más corto de lo conveniente. Indicar la extensión actual.   |
| **FAIL**           | Excede o no alcanza un límite exigido (brief o canal). Indicar límite y extensión actual. Si ese límite es obligatorio, aplica la regla de escalamiento. |
| **NO VERIFICABLE** | No hay límite definido ni información del canal para evaluarlo.                                  |

### 17. Consistencia entre versiones — IMPORTANTE

**Aplica a:** entregas marcadas como **Corrección** o **Versión final**.
En una **Primera entrega**: No aplica.

**Qué se revisa:** que se hayan aplicado las correcciones solicitadas y
que no se hayan introducido cambios no pedidos o nuevos errores.

**Referencia:** versión anterior y observaciones previas (reporte de
Quality Gate anterior o correcciones solicitadas).

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Todas las correcciones solicitadas se aplicaron y no hay cambios no pedidos.                          |
| **WARNING**        | Hay cambios no solicitados que no afectan el mensaje, o correcciones aplicadas de forma parcial.     |
| **FAIL**           | Una corrección solicitada no se aplicó, o se introdujo un error que no existía en la versión anterior. |
| **NO VERIFICABLE** | No se proporcionó la versión anterior ni las observaciones previas.                                   |
