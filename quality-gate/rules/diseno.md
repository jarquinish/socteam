# Reglas — Diseño

Reglas del Quality Gate para entregables de la Gerencia de Diseño:
piezas para redes sociales, banners, presentaciones, material impreso,
señalética, key visuals, adaptaciones, animaciones y cualquier pieza cuyo
valor principal sea visual.

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

---

## Preferencias estéticas vs. incumplimientos

**No convertir preferencias estéticas subjetivas en FAIL.**

Un **FAIL** requiere evidencia concreta de incumplimiento de alguna de
estas cuatro referencias:

1. **Brief.**
2. **Brandbook SOC.**
3. **Especificación técnica** (dimensiones, formato, resolución, peso,
   márgenes, sangrado, requisitos de la plataforma).
4. **Requisito acordado** (requisitos obligatorios del formulario o
   acuerdos documentados con el solicitante).

Si una observación no puede vincularse a una de estas referencias, es una
preferencia:

- Nunca puede ser **FAIL**.
- Puede registrarse como **WARNING** sólo si se explica el beneficio
  concreto del cambio (por ejemplo, mejorar la lectura del CTA o reforzar
  la jerarquía del mensaje principal).
- En cualquier otro caso se registra como **sugerencia**, sin
  clasificación.

| Es preferencia (no FAIL)                           | Es incumplimiento (puede ser FAIL)                                    |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| "Se vería mejor con más aire."                     | El logo invade el área de protección definida en el Brandbook.        |
| "Prefiero otra foto."                              | La fotografía contradice el estilo fotográfico definido en el Brandbook. |
| "El azul podría ser más intenso."                  | El color usado no pertenece a la paleta oficial.                      |
| "Cambiaría el orden de los elementos."             | El brief pide destacar un mensaje y la pieza destaca otro.            |

### Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Descripción** del elemento evaluado.
- **Ubicación** en el entregable (pieza, slide, página, zona, segundo de
  la animación, adaptación).
- **Referencia** contra la que se compara: sección del brief, regla del
  Brandbook, especificación técnica o requisito acordado.
- **Dato medible** cuando exista: medida, código de color, tipografía,
  resolución, peso de archivo.

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia para comparar, el criterio es **NO VERIFICABLE**
y se indica qué información hizo falta.

### Criterios que no aplican

Cuando un criterio no aplica al entregable (por ejemplo, fotografía en una
pieza sólo tipográfica, o consistencia entre adaptaciones en una pieza
única), se registra como **No aplica** y no se considera en el resultado
general. No aplicar no es lo mismo que NO VERIFICABLE.

---

## Resumen de criterios

| #  | Criterio                          | Prioridad  |
| -- | --------------------------------- | ---------- |
| 1  | Cumplimiento del brief            | CRÍTICO    |
| 2  | Objetivo                          | CRÍTICO    |
| 3  | Audiencia                         | IMPORTANTE |
| 4  | Brandbook SOC                     | CRÍTICO    |
| 5  | Identidad visual                  | IMPORTANTE |
| 6  | Jerarquía                         | IMPORTANTE |
| 7  | Composición                       | DESEABLE   |
| 8  | Legibilidad                       | IMPORTANTE |
| 9  | Tipografía                        | IMPORTANTE |
| 10 | Paleta                            | IMPORTANTE |
| 11 | Fotografía                        | IMPORTANTE |
| 12 | Uso de marca                      | CRÍTICO    |
| 13 | Copy                              | IMPORTANTE |
| 14 | Ortografía                        | IMPORTANTE |
| 15 | CTA                               | IMPORTANTE |
| 16 | Formato                           | IMPORTANTE |
| 17 | Dimensiones                       | IMPORTANTE |
| 18 | Versiones                         | IMPORTANTE |
| 19 | Consistencia entre adaptaciones   | IMPORTANTE |
| 20 | Resolución                        | IMPORTANTE |
| 21 | Preparación para canal final      | CRÍTICO    |

---

## Criterios

### 1. Cumplimiento del brief — CRÍTICO

**Qué se revisa:** que la pieza responda a lo solicitado en el brief:
piezas pedidas, mensaje, elementos, referencias e indicaciones.

**Referencia:** brief.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Cada indicación del brief tiene correspondencia identificable en la pieza.                       |
| **WARNING**        | Se cumple el brief, pero alguna indicación se atiende de forma parcial o poco evidente.          |
| **FAIL**           | Una indicación explícita del brief no se atiende o se contradice. Citar la indicación y el elemento. |
| **NO VERIFICABLE** | No se proporcionó brief.                                                                         |

### 2. Objetivo — CRÍTICO

**Qué se revisa:** que las decisiones visuales contribuyan al objetivo
declarado (reconocimiento, información, registro, conversión, etc.).

**Referencia:** campo OBJETIVO del formulario o brief.

| Clasificación      | Evidencia                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **PASS**           | Lo que la pieza destaca visualmente conduce al objetivo declarado.                            |
| **WARNING**        | El objetivo se atiende, pero hay elementos visuales que lo debilitan o distraen.              |
| **FAIL**           | La pieza destaca un mensaje o acción distintos a los que el objetivo requiere.                |
| **NO VERIFICABLE** | No se indicó objetivo ni en el formulario ni en el brief.                                     |

### 3. Audiencia — IMPORTANTE

**Qué se revisa:** que imágenes, personas representadas, contextos y
recursos visuales sean pertinentes para la audiencia indicada.

**Referencia:** campo AUDIENCIA del formulario o brief.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Los recursos visuales son pertinentes para la audiencia indicada.                                 |
| **WARNING**        | Algún recurso visual es poco representativo de la audiencia.                                      |
| **FAIL**           | La pieza representa claramente a otra audiencia o contradice el perfil definido en el brief.      |
| **NO VERIFICABLE** | No se indicó audiencia.                                                                           |

### 4. Brandbook SOC — CRÍTICO

**Qué se revisa:** cumplimiento general de las reglas del Brandbook SOC
vigente, incluidas las que no cubren los criterios específicos de esta
lista (elementos gráficos auxiliares, iconografía, usos no permitidos,
aplicaciones especiales).

Logo, tipografía, paleta y fotografía se evalúan en sus propios criterios
para no duplicar observaciones.

**Referencia:** Brandbook SOC vigente.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza respeta las reglas del Brandbook aplicables.                                                 |
| **WARNING**        | Hay aplicaciones al límite de lo permitido o poco habituales, sin contradecir una regla explícita.    |
| **FAIL**           | La pieza incumple una regla explícita del Brandbook. Citar la regla y la sección.                    |
| **NO VERIFICABLE** | No se dispone del Brandbook o de la sección aplicable.                                                |

### 5. Identidad visual — IMPORTANTE

**Qué se revisa:** que la pieza sea reconocible como SOC y consistente
con el sistema visual de la campaña o línea de comunicación a la que
pertenece.

**Referencia:** lineamientos visuales de la campaña, key visual, piezas
aprobadas previas.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza es consistente con el sistema visual de referencia.                                      |
| **WARNING**        | Hay variaciones de estilo respecto a las piezas de referencia.                                    |
| **FAIL**           | La pieza contradice el key visual o los lineamientos visuales definidos para la campaña.          |
| **NO VERIFICABLE** | No se proporcionaron lineamientos, key visual ni piezas de referencia.                            |

### 6. Jerarquía — IMPORTANTE

**Qué se revisa:** que el orden de lectura visual destaque primero el
mensaje principal y después la información secundaria y el CTA.

**Referencia:** brief, objetivo y mensaje principal solicitado.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El elemento con mayor peso visual es el mensaje principal solicitado.                            |
| **WARNING**        | Hay elementos secundarios compitiendo en peso visual con el mensaje principal.                   |
| **FAIL**           | El elemento más destacado no es el mensaje principal que pide el brief.                          |
| **NO VERIFICABLE** | No se definió cuál es el mensaje principal.                                                      |

### 7. Composición — DESEABLE

**Qué se revisa:** equilibrio, alineación, márgenes, espaciado y uso de
retícula.

**Referencia:** retícula o márgenes del Brandbook o plantilla, si existen.

Este es el criterio más expuesto a preferencias subjetivas. Aplicar con
rigor la sección
[Preferencias estéticas vs. incumplimientos](#preferencias-estéticas-vs-incumplimientos).

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Elementos alineados y márgenes consistentes.                                                          |
| **WARNING**        | Hay desalineaciones, márgenes inconsistentes o saturación visibles. Indicar ubicación.               |
| **FAIL**           | Incumple una retícula, margen o plantilla definidos en el Brandbook o acordados. Sin una de estas referencias, no puede asignarse FAIL. |
| **NO VERIFICABLE** | El archivo no permite ver la pieza completa.                                                          |

### 8. Legibilidad — IMPORTANTE

**Qué se revisa:** que todos los textos puedan leerse en el tamaño y
contexto de uso final: tamaño, contraste con el fondo, peso tipográfico,
textos sobre imagen.

**Referencia:** canal de uso, tamaños mínimos del Brandbook o especificaciones
de la plataforma.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Todos los textos se leen con claridad en el tamaño de uso final.                                        |
| **WARNING**        | Hay textos secundarios con bajo contraste o tamaño reducido. Indicar ubicación.                        |
| **FAIL**           | Un texto relevante (mensaje, CTA, dato, legal) no se puede leer en el tamaño de uso final, o incumple un tamaño mínimo definido. |
| **NO VERIFICABLE** | El archivo no permite evaluar la pieza a su tamaño real (vista previa reducida, baja resolución).       |

### 9. Tipografía — IMPORTANTE

**Qué se revisa:** uso de las familias tipográficas oficiales, pesos,
estilos y combinaciones permitidas.

**Referencia:** Brandbook SOC.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | Se usan las tipografías y estilos oficiales.                                                   |
| **WARNING**        | Se usan las tipografías oficiales, pero con demasiados pesos o estilos en una misma pieza.    |
| **FAIL**           | Se usa una tipografía no autorizada o una aplicación que el Brandbook prohíbe. Indicar cuál.  |
| **NO VERIFICABLE** | No se dispone de la sección tipográfica del Brandbook, o no es posible identificar la fuente usada en el archivo. |

### 10. Paleta — IMPORTANTE

**Qué se revisa:** uso de los colores oficiales y de sus combinaciones y
proporciones permitidas.

**Referencia:** Brandbook SOC y paleta de la campaña, si existe.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Los colores pertenecen a la paleta oficial o de campaña.                                            |
| **WARNING**        | Los colores son oficiales, pero su proporción o combinación se aleja de lo habitual.               |
| **FAIL**           | Se usa un color fuera de la paleta o una combinación prohibida. Indicar el código de color detectado. |
| **NO VERIFICABLE** | No se dispone de la paleta de referencia, o el archivo no permite identificar los colores con precisión. |

### 11. Fotografía — IMPORTANTE

**Qué se revisa:** que las imágenes correspondan al estilo fotográfico
definido, tengan calidad técnica suficiente y cuenten con derechos de uso.

**Referencia:** Brandbook SOC, lineamientos de campaña, licencia o
procedencia de la imagen.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Las imágenes corresponden al estilo definido, son técnicamente correctas y su procedencia está clara.  |
| **WARNING**        | Hay imágenes con calidad técnica mejorable (encuadre, iluminación, retoque) sin incumplir una regla.   |
| **FAIL**           | La imagen contradice el estilo fotográfico definido, está pixelada o deformada, o tiene marca de agua. |
| **NO VERIFICABLE** | No se dispone del estilo fotográfico de referencia, o no se informó la procedencia o licencia de la imagen. |

### 12. Uso de marca — CRÍTICO

**Qué se revisa:** aplicación del logotipo SOC y de marcas asociadas:
versión correcta, área de protección, tamaño mínimo, proporción, color,
fondo y posición.

**Referencia:** Brandbook SOC y lineamientos de cobranding, si aplican.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | El logo se aplica en versión, tamaño, color y posición permitidos.                                     |
| **WARNING**        | El logo es correcto, pero su visibilidad es baja en el contexto de la pieza.                           |
| **FAIL**           | El logo está deformado, recortado, en versión o color no permitidos, invade su área de protección, está por debajo del tamaño mínimo o falta cuando es requerido. |
| **NO VERIFICABLE** | No se dispone de las reglas de uso de marca, o de los lineamientos de la marca asociada en cobranding. |

### 13. Copy — IMPORTANTE

**Qué se revisa:** que el texto incluido en la pieza coincida con el copy
aprobado, sin omisiones, cambios o textos provisionales (lorem ipsum,
"texto aquí").

La revisión completa del texto se realiza con las
[reglas de Contenido](contenido.md) cuando el copy no llega aprobado.

**Referencia:** copy aprobado o brief.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | El texto coincide con el copy aprobado.                                                             |
| **WARNING**        | Hay diferencias menores de puntuación o de saltos de línea que no alteran el mensaje.              |
| **FAIL**           | Falta texto, se modificó el mensaje aprobado o hay textos provisionales.                            |
| **NO VERIFICABLE** | No se proporcionó el copy aprobado para comparar.                                                   |

### 14. Ortografía — IMPORTANTE

**Qué se revisa:** ortografía, acentuación, mayúsculas y puntuación del
texto dentro de la pieza.

**Referencia:** normas de la lengua española y nombres oficiales de
productos, marcas y personas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | No se detectan errores ortográficos.                                                                    |
| **WARNING**        | Hay errores menores aislados en texto secundario. Listar cada uno con su ubicación.                     |
| **FAIL**           | Hay errores en titulares, nombres de marca o producto, datos de contacto o CTA, o errores recurrentes. |
| **NO VERIFICABLE** | El texto no es legible en el archivo proporcionado.                                                     |

### 15. CTA — IMPORTANTE

**Qué se revisa:** presencia, visibilidad y exactitud de la llamada a la
acción (botón, liga, teléfono, código QR, registro).

**Referencia:** objetivo, brief y requisitos obligatorios.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El CTA es visible, coherente con el objetivo y sus datos son correctos.                          |
| **WARNING**        | El CTA existe, pero tiene poco peso visual o se confunde con otros elementos.                    |
| **FAIL**           | Falta el CTA requerido, sus datos son incorrectos o el QR o la liga no funcionan.               |
| **NO VERIFICABLE** | No se indicó qué CTA se esperaba, o no es posible comprobar la liga o el QR.                     |

### 16. Formato — IMPORTANTE

**Qué se revisa:** tipo de archivo, modo de color, capas, fuentes
incrustadas o convertidas, sangrado y marcas de corte cuando se requieran.

**Referencia:** especificaciones del canal, del proveedor de impresión o
del brief.

| Clasificación      | Evidencia                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **PASS**           | El archivo cumple el formato requerido.                                                       |
| **WARNING**        | El formato es utilizable, pero no es el óptimo para el canal.                                 |
| **FAIL**           | El formato incumple una especificación exigida (tipo de archivo, modo de color, sangrado).    |
| **NO VERIFICABLE** | No se indicaron especificaciones de formato ni el canal final.                                |

### 17. Dimensiones — IMPORTANTE

**Qué se revisa:** medidas, proporción y orientación de cada pieza.

**Referencia:** brief, especificaciones del canal o del proveedor.

| Clasificación      | Evidencia                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **PASS**           | Las dimensiones coinciden con las solicitadas.                                              |
| **WARNING**        | Las dimensiones son correctas, pero hay elementos cerca de zonas de recorte o de interfaz.  |
| **FAIL**           | Las dimensiones o proporción no coinciden con las solicitadas. Indicar medida esperada y medida real. |
| **NO VERIFICABLE** | No se indicaron las dimensiones requeridas ni el canal final.                               |

### 18. Versiones — IMPORTANTE

**Qué se revisa:** que se entregue la versión correcta y, en entregas de
**Corrección** o **Versión final**, que se hayan aplicado las correcciones
solicitadas sin introducir cambios no pedidos.

**Referencia:** versión anterior, observaciones previas y nomenclatura de
archivos acordada.

| Clasificación      | Evidencia                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **PASS**           | Es la versión correcta y todas las correcciones solicitadas están aplicadas.                            |
| **WARNING**        | Hay cambios no solicitados que no afectan la pieza, o la nomenclatura del archivo no permite identificar la versión. |
| **FAIL**           | Una corrección solicitada no se aplicó, se introdujo un error nuevo o se entregó una versión anterior.   |
| **NO VERIFICABLE** | No se proporcionó la versión anterior ni las observaciones previas. En una Primera entrega: No aplica.   |

### 19. Consistencia entre adaptaciones — IMPORTANTE

**Aplica a:** entregables con varias adaptaciones de una misma pieza
(tamaños, formatos, canales o idiomas).

**Qué se revisa:** que todas las adaptaciones mantengan el mismo mensaje,
copy, CTA, marca y sistema visual.

**Referencia:** pieza maestra o adaptación aprobada.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Todas las adaptaciones son consistentes con la pieza maestra.                                     |
| **WARNING**        | Hay diferencias de acomodo justificadas por el formato que debilitan algún elemento.             |
| **FAIL**           | Una adaptación cambia el mensaje, el copy, el CTA o la marca, u omite un elemento obligatorio. Indicar cuál. |
| **NO VERIFICABLE** | No se proporcionaron todas las adaptaciones o no se identificó la pieza maestra.                  |

### 20. Resolución — IMPORTANTE

**Qué se revisa:** que la resolución de la pieza y de sus imágenes sea
suficiente para el canal final (pantalla o impresión).

**Referencia:** especificaciones del canal o del proveedor.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | La resolución es adecuada para el canal final.                                                         |
| **WARNING**        | La resolución es suficiente, pero hay compresión o artefactos visibles en algún elemento.            |
| **FAIL**           | La resolución no alcanza la requerida o hay elementos pixelados. Indicar resolución esperada y real.  |
| **NO VERIFICABLE** | El archivo proporcionado es una vista previa o exportación que no permite medir la resolución real.    |

### 21. Preparación para canal final — CRÍTICO

**Qué se revisa:** que la pieza esté lista para publicarse, imprimirse o
entregarse sin intervención adicional: zonas seguras de la plataforma,
peso de archivo, nomenclatura, archivos editables y finales, fuentes y
enlaces incluidos, textos legales requeridos.

**Referencia:** campo CANAL del formulario, especificaciones de la
plataforma o del proveedor, y requisitos acordados.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La pieza puede utilizarse en el canal final sin ajustes.                                                |
| **WARNING**        | Puede utilizarse, pero hay detalles menores de entrega (nomenclatura, organización de archivos).       |
| **FAIL**           | La pieza no puede utilizarse en el canal final sin intervención: excede el peso permitido, invade zonas de interfaz, faltan archivos finales o editables requeridos. |
| **NO VERIFICABLE** | No se indicó el canal final ni sus especificaciones.                                                    |
