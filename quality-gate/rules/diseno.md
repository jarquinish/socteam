# Reglas — Diseño

> **SOC QUALITY GATE — CRITERIOS V1 — PROPUESTA DE DIRECCIÓN**
> Estado: **PENDIENTE DE CALIBRACIÓN CON GERENTES.**

Reglas del Quality Gate para entregables de la Gerencia de Diseño:
piezas para redes sociales, banners, presentaciones, material impreso,
señalética, key visuals, adaptaciones, animaciones y cualquier pieza cuyo
valor principal sea visual.

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

---

## Preferencias estéticas vs. incumplimientos

**Nunca utilizar "no me gusta" como justificación suficiente para FAIL.**
No convertir preferencias estéticas subjetivas en FAIL.

Toda observación debe vincularse con al menos una de estas referencias:

1. **Brief.**
2. **Brandbook** o sistema visual aplicable.
3. **Objetivo.**
4. **Audiencia.**
5. **Canal.**
6. **Principio visual** verificable: legibilidad, contraste, jerarquía o
   lectura demostrables en la pieza, no un gusto personal.
7. **Requisito técnico** (dimensiones, formato, resolución, peso,
   márgenes, sangrado, requisitos de la plataforma) o requisito acordado.

Si una observación no puede vincularse a ninguna de estas referencias, es
una preferencia:

- Nunca puede ser **FAIL**.
- Puede registrarse como **WARNING** sólo si se explica el beneficio
  concreto del cambio (por ejemplo, mejorar la lectura del CTA o reforzar
  la jerarquía del mensaje principal).
- En cualquier otro caso se registra como **recomendación** o en la
  capa de **excelencia / oportunidad de elevar**, sin clasificación.

| Es preferencia (no FAIL)                           | Es incumplimiento (puede ser FAIL)                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| "Se vería mejor con más aire."                     | El logo invade el área de protección definida en el Brandbook.           |
| "Prefiero otra foto."                              | La fotografía contradice el estilo fotográfico definido en el Brandbook. |
| "El azul podría ser más intenso."                  | El color usado no pertenece a la paleta oficial.                         |
| "Cambiaría el orden de los elementos."             | El brief pide destacar un mensaje y la pieza destaca otro.               |

### Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Descripción** del elemento evaluado.
- **Ubicación** en el entregable (pieza, slide, página, zona, segundo de
  la animación, adaptación).
- **Referencia** contra la que se compara (ver lista anterior).
- **Dato medible** cuando exista: medida, código de color, tipografía,
  resolución, peso de archivo.

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia para comparar, el criterio es **NO VERIFICABLE**
y se indica qué información hizo falta.

### Versiones posteriores

La comparación contra versiones anteriores se realiza en la
[Segunda revisión](../quality-gate.md#segunda-revisión), no como criterio
de esta lista.

---

## Resumen de criterios

| #  | Criterio                          | Importancia por defecto  |
| -- | --------------------------------- | ------------------------ |
| 1  | Cumplimiento del brief            | CRÍTICO                  |
| 2  | Información correcta              | CRÍTICO                  |
| 3  | Identidad / Brandbook             | CRÍTICO                  |
| 4  | Logos y marcas                    | CRÍTICO (condicional)    |
| 5  | Legibilidad                       | CRÍTICO                  |
| 6  | Formato y dimensiones             | CRÍTICO                  |
| 7  | Ortografía                        | CRÍTICO                  |
| 8  | Resolución / calidad técnica      | CRÍTICO                  |
| 9  | Jerarquía visual                  | IMPORTANTE               |
| 10 | CTA                               | IMPORTANTE (condicional) |
| 11 | Tipografía                        | IMPORTANTE               |
| 12 | Paleta                            | IMPORTANTE               |
| 13 | Fotografía / imagen               | IMPORTANTE (condicional) |
| 14 | Composición                       | IMPORTANTE               |
| 15 | Consistencia entre adaptaciones   | IMPORTANTE (condicional) |
| 16 | Archivos finales                  | IMPORTANTE               |
| 17 | Editable                          | IMPORTANTE (condicional) |
| 18 | Sofisticación visual              | DESEABLE                 |

**Condicional:** el criterio sólo aplica en los casos indicados en su
ficha; en los demás es N/A.

---

## CRÍTICOS

### 1. Cumplimiento del brief — CRÍTICO

**Qué se revisa:** que la pieza resuelva la solicitud realizada: piezas
pedidas, mensaje, elementos, referencias e indicaciones. Incluye que lo
que la pieza destaca contribuya al **objetivo** y que sus recursos
visuales sean pertinentes para la **audiencia** indicada.

**Referencia:** brief, campos OBJETIVO y AUDIENCIA del formulario.

| Clasificación      | Evidencia                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **PASS**           | Cada indicación del brief tiene correspondencia en la pieza, y ésta es coherente con objetivo y audiencia. |
| **WARNING**        | Se cumple el brief, pero alguna indicación secundaria se atiende de forma parcial, o algún recurso visual es poco representativo de la audiencia. |
| **FAIL**           | Una indicación esencial del brief no se atiende o se contradice, la pieza destaca un mensaje distinto al que el objetivo requiere, o representa claramente a otra audiencia. |
| **NO VERIFICABLE** | No se proporcionó brief ni objetivo.                                                                     |

### 2. Información correcta — CRÍTICO

**Qué se revisa:** fechas, horarios, precios, nombres, cargos, lugares,
CTA, condiciones y demás datos proporcionados. Incluye que el texto de la
pieza coincida con el **copy aprobado**, sin omisiones, cambios o textos
provisionales (lorem ipsum, "texto aquí").

La revisión completa del texto se realiza con las
[reglas de Contenido](contenido.md) cuando el copy no llega aprobado.

**Referencia:** copy aprobado, brief e información proporcionada.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Todos los datos coinciden con la información proporcionada y el copy aprobado.                     |
| **WARNING**        | Hay diferencias menores de puntuación o saltos de línea respecto al copy que no alteran el mensaje. |
| **FAIL**           | Un dato no coincide con la información proporcionada, falta texto, se modificó el mensaje aprobado o hay textos provisionales. Indicar dato esperado y dato en la pieza. |
| **NO VERIFICABLE** | No se proporcionó el copy aprobado ni la información de referencia.                                |

### 3. Identidad / Brandbook — CRÍTICO

**Qué se revisa:** cumplimiento del Brandbook SOC y del sistema visual
aplicable (campaña, key visual, línea de comunicación). Cuando existan,
se tratan como **fuente de verdad**. Incluye elementos gráficos
auxiliares, iconografía, usos no permitidos y aplicaciones especiales.

Logo, tipografía, paleta y fotografía se evalúan en sus propios criterios
para no duplicar observaciones.

**Referencia:** Brandbook SOC vigente, lineamientos visuales de campaña,
key visual y piezas aprobadas previas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza respeta el Brandbook y es consistente con el sistema visual de referencia.                     |
| **WARNING**        | Hay aplicaciones al límite de lo permitido o variaciones de estilo respecto a las piezas de referencia, sin contradecir una regla explícita. |
| **FAIL**           | La pieza incumple una regla explícita del Brandbook o contradice el key visual o los lineamientos de campaña. Citar la regla y la sección. |
| **NO VERIFICABLE** | No se dispone del Brandbook, de la sección aplicable ni de lineamientos o piezas de referencia.         |

### 4. Logos y marcas — CRÍTICO (condicional)

**Aplica cuando:** la pieza incluye el logotipo SOC o marcas asociadas, o
el brief lo requiere.

**Qué se revisa:** versión correcta, proporciones, legibilidad,
convivencia con otras marcas, jerarquía, uso autorizado, área de
protección, tamaño mínimo, color y fondo.

**Referencia:** Brandbook SOC y lineamientos de cobranding, si aplican.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | Los logos se aplican en versión, proporción, tamaño, color y posición permitidos, con uso autorizado.  |
| **WARNING**        | Los logos son correctos, pero su visibilidad o convivencia con otras marcas es débil en el contexto de la pieza. |
| **FAIL**           | Un logo está deformado, recortado, en versión o color no permitidos, invade su área de protección, está por debajo del tamaño mínimo, falta cuando es requerido o no tiene uso autorizado. |
| **NO VERIFICABLE** | No se dispone de las reglas de uso de marca, de los lineamientos de la marca asociada o de la autorización de uso. |

### 5. Legibilidad — CRÍTICO

**Qué se revisa:** que la información esencial (mensaje, dato, CTA,
legal) pueda consumirse correctamente en el formato y canal final:
tamaño, contraste, peso tipográfico, textos sobre imagen, tiempo en
pantalla en piezas animadas.

**Referencia:** canal de uso, tamaños mínimos del Brandbook o
especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La información esencial se lee con claridad en el tamaño y canal final.                                 |
| **WARNING**        | Hay textos secundarios con bajo contraste o tamaño reducido. Indicar ubicación.                        |
| **FAIL**           | Información esencial no puede leerse en el tamaño o canal final, o incumple un tamaño mínimo definido.  |
| **NO VERIFICABLE** | El archivo no permite evaluar la pieza a su tamaño real (vista previa reducida, baja resolución).       |

### 6. Formato y dimensiones — CRÍTICO

**Qué se revisa:** que la pieza cumpla las especificaciones del canal:
medidas, proporción, orientación, tipo de archivo, modo de color, peso,
zonas seguras de la plataforma, sangrado y marcas de corte cuando se
requieran.

**Referencia:** brief, especificaciones del canal, de la plataforma o del
proveedor de impresión.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Formato y dimensiones cumplen las especificaciones del canal.                                         |
| **WARNING**        | Cumple, pero hay elementos cerca de zonas de recorte o de interfaz, o el formato no es el óptimo.     |
| **FAIL**           | Dimensiones, proporción, formato, peso o zonas seguras incumplen una especificación exigida. Indicar valor esperado y real. |
| **NO VERIFICABLE** | No se indicaron las especificaciones ni el canal final.                                               |

### 7. Ortografía — CRÍTICO

**Qué se revisa:** ortografía, acentuación, mayúsculas y puntuación del
texto dentro de la pieza. No deben salir errores textuales evidentes.

**Referencia:** normas de la lengua española y nombres oficiales de
productos, marcas y personas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | No se detectan errores ortográficos.                                                                    |
| **WARNING**        | Detalles estilísticos (puntuación opcional, uso de mayúsculas en títulos) que no constituyen errores.  |
| **FAIL**           | Hay errores textuales evidentes. Listar cada uno con su ubicación.                                     |
| **NO VERIFICABLE** | El texto no es legible en el archivo proporcionado.                                                     |

### 8. Resolución / calidad técnica — CRÍTICO

**Qué se revisa:** que la resolución y la calidad técnica de la pieza y
de sus imágenes sean suficientes para el destino final (pantalla o
impresión): nitidez, compresión, artefactos, imágenes deformadas o con
marca de agua.

**Referencia:** especificaciones del canal o del proveedor.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | La calidad técnica es adecuada para el destino final.                                                  |
| **WARNING**        | Es suficiente, pero hay compresión o artefactos visibles en algún elemento secundario.                |
| **FAIL**           | La resolución no alcanza la requerida, o hay elementos pixelados, deformados o con marca de agua. Indicar resolución esperada y real. |
| **NO VERIFICABLE** | El archivo proporcionado es una vista previa o exportación que no permite medir la calidad real.       |

---

## IMPORTANTES

### 9. Jerarquía visual — IMPORTANTE

**Qué se revisa:** que sea claro qué mirar primero, qué información es
principal, qué información es secundaria y qué acción debe realizarse
cuando exista CTA.

**Referencia:** brief, objetivo y mensaje principal solicitado.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El elemento con mayor peso visual es el mensaje principal y el orden de lectura es claro.        |
| **WARNING**        | Hay elementos secundarios compitiendo en peso visual con el mensaje principal o con el CTA.      |
| **FAIL**           | El elemento más destacado no es el mensaje principal que pide el brief, o la acción esperada no se identifica. |
| **NO VERIFICABLE** | No se definió cuál es el mensaje principal.                                                      |

### 10. CTA — IMPORTANTE (condicional)

**Aplica cuando:** el objetivo o el brief requieren una acción. Si no, es N/A.

**Qué se revisa:** presencia, visibilidad y exactitud de la llamada a la
acción (botón, liga, teléfono, código QR, registro).

**Referencia:** objetivo, brief y requisitos obligatorios.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El CTA es visible, coherente con el objetivo y sus datos son correctos.                          |
| **WARNING**        | El CTA existe, pero tiene poco peso visual o se confunde con otros elementos.                    |
| **FAIL**           | Falta el CTA requerido, sus datos son incorrectos o el QR o la liga no funcionan.               |
| **NO VERIFICABLE** | No es posible comprobar la liga o el QR.                                                         |

### 11. Tipografía — IMPORTANTE

**Qué se revisa:** consistencia con el sistema de marca (familias,
pesos, estilos y combinaciones permitidas) y legibilidad.

**Referencia:** Brandbook SOC.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | Se usan las tipografías y estilos oficiales.                                                   |
| **WARNING**        | Se usan las tipografías oficiales, pero con demasiados pesos o estilos en una misma pieza.    |
| **FAIL**           | Se usa una tipografía no autorizada o una aplicación que el Brandbook prohíbe. Indicar cuál.  |
| **NO VERIFICABLE** | No se dispone de la sección tipográfica del Brandbook, o no es posible identificar la fuente usada. |

### 12. Paleta — IMPORTANTE

**Qué se revisa:** aplicación coherente de los colores con la identidad
y la campaña: colores oficiales, combinaciones y proporciones permitidas.

**Referencia:** Brandbook SOC y paleta de campaña, si existe.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Los colores pertenecen a la paleta oficial o de campaña.                                            |
| **WARNING**        | Los colores son oficiales, pero su proporción o combinación se aleja de lo habitual.               |
| **FAIL**           | Se usa un color fuera de la paleta o una combinación prohibida. Indicar el código de color detectado. |
| **NO VERIFICABLE** | No se dispone de la paleta de referencia, o el archivo no permite identificar los colores con precisión. |

### 13. Fotografía / imagen — IMPORTANTE (condicional)

**Aplica cuando:** la pieza incluye fotografías o imágenes. Si no, es N/A.

**Qué se revisa:** calidad, pertinencia, consistencia, estilo, relación
con el mensaje y procedencia o derechos de uso.

**Referencia:** Brandbook SOC, lineamientos de campaña, licencia o
procedencia de la imagen.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Las imágenes son pertinentes, consistentes con el estilo definido y su procedencia está clara.         |
| **WARNING**        | Hay imágenes con calidad mejorable (encuadre, iluminación, retoque) o poca relación con el mensaje, sin incumplir una regla. |
| **FAIL**           | La imagen contradice el estilo fotográfico definido, contradice el mensaje o no tiene derechos de uso. |
| **NO VERIFICABLE** | No se dispone del estilo fotográfico de referencia, o no se informó la procedencia o licencia.         |

### 14. Composición — IMPORTANTE

**Qué se revisa:** equilibrio, organización y comprensión: alineación,
márgenes, espaciado, saturación y uso de retícula.

**Referencia:** retícula, márgenes o plantilla del Brandbook, si existen.

Es el criterio más expuesto a preferencias subjetivas. **No convertir
preferencias estéticas en FAIL.** Aplicar con rigor la sección
[Preferencias estéticas vs. incumplimientos](#preferencias-estéticas-vs-incumplimientos).

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza está organizada y se comprende sin esfuerzo.                                                 |
| **WARNING**        | Hay desalineaciones, márgenes inconsistentes o saturación que dificultan la comprensión. Indicar ubicación y efecto. |
| **FAIL**           | Incumple una retícula, margen o plantilla definidos, o la organización impide comprender la información esencial. Sin una de estas evidencias, no puede asignarse FAIL. |
| **NO VERIFICABLE** | El archivo no permite ver la pieza completa.                                                          |

### 15. Consistencia entre adaptaciones — IMPORTANTE (condicional)

**Aplica cuando:** existe una familia de piezas o varias adaptaciones de
una misma pieza (tamaños, formatos, canales o idiomas). Si no, es N/A.

**Qué se revisa:** que todas mantengan concepto y sistema: mensaje, copy,
CTA, marca y lenguaje visual.

**Referencia:** pieza maestra o adaptación aprobada.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Todas las adaptaciones son consistentes con la pieza maestra.                                     |
| **WARNING**        | Hay diferencias de acomodo justificadas por el formato que debilitan algún elemento.             |
| **FAIL**           | Una adaptación cambia el concepto, el mensaje, el copy, el CTA o la marca, u omite un elemento obligatorio. Indicar cuál. |
| **NO VERIFICABLE** | No se proporcionaron todas las adaptaciones o no se identificó la pieza maestra.                  |

### 16. Archivos finales — IMPORTANTE

**Qué se revisa:** que se proporcionen los formatos necesarios para el
uso final (exportaciones por canal, versiones para impresión o pantalla),
con fuentes y enlaces incluidos y una nomenclatura que permita
identificarlos.

**Referencia:** campo CANAL del formulario, brief y requisitos acordados.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Se entregaron todos los archivos finales necesarios, listos para usarse.                               |
| **WARNING**        | Los archivos están completos, pero la nomenclatura u organización dificultan identificarlos.           |
| **FAIL**           | Falta un archivo final requerido o el entregado no puede utilizarse sin intervención adicional.         |
| **NO VERIFICABLE** | No se indicó qué archivos finales se requerían.                                                         |

### 17. Editable — IMPORTANTE (condicional)

**Aplica sólo cuando:** el proceso requiere archivo editable (por
ejemplo, plantillas para otras áreas, piezas que se adaptarán, entrega a
proveedor). Si no, es N/A.

**Qué se revisa:** que el editable se entregue, abra correctamente,
corresponda a la versión final y tenga capas, fuentes y vínculos
organizados.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | El editable corresponde a la versión final y puede trabajarse sin problemas.                       |
| **WARNING**        | El editable funciona, pero capas o elementos están desorganizados.                                 |
| **FAIL**           | El editable requerido falta, no corresponde a la versión final o no puede abrirse o editarse.      |
| **NO VERIFICABLE** | No se proporcionó el editable para revisarlo.                                                      |

---

## DESEABLE

### 18. Sofisticación visual — DESEABLE

**Qué se revisa:** la capacidad de la pieza de elevar la percepción de
la marca SOC: cuidado del detalle, calidad de ejecución, nivel visual
frente a las mejores piezas de referencia.

Este criterio alimenta principalmente la capa de **excelencia /
oportunidad de elevar**. Nunca bloquea una entrega.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza eleva o mantiene el nivel de percepción de marca de las piezas de referencia.             |
| **WARNING**        | La pieza cumple, pero hay oportunidades concretas de elevarla. Explicar el beneficio.              |
| **FAIL**           | No se usa. Una oportunidad de sofisticación se registra como WARNING o en la capa de excelencia.   |
| **NO VERIFICABLE** | El archivo no permite apreciar la pieza completa o a su tamaño real.                               |
