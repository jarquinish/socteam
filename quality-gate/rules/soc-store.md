# Reglas — SOC Store

Reglas del Quality Gate para entregables de SOC Store: desarrollo de
productos, artículos promocionales, pedidos de producción, reposición de
inventario, cotizaciones, órdenes a proveedores y entregas.

Estas reglas se aplican dentro del flujo definido en
[`quality-gate.md`](../quality-gate.md).

---

## Cómo usar estas reglas

1. Identificar el **tipo de proyecto** y la **etapa** en que se encuentra.
2. Determinar qué criterios **aplican** (ver
   [Aplicabilidad](#aplicabilidad-según-el-tipo-de-proyecto)).
3. Evaluar sólo los criterios que aplican y asignar una clasificación:
   **PASS**, **WARNING**, **FAIL** o **NO VERIFICABLE**.
4. Registrar la **evidencia** que sustenta la clasificación.
5. Considerar la **prioridad** del criterio (CRÍTICO, IMPORTANTE o DESEABLE)
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

## Aplicabilidad según el tipo de proyecto

Los proyectos de SOC Store varían mucho entre sí. Una reposición de
inventario no requiere muestra; una cotización todavía no tiene
producción ni entrega.

**No marcar como error información que simplemente no corresponda al
tipo de proyecto.**

| Situación                                                              | Cómo se registra   | ¿Cuenta en el resultado? |
| ---------------------------------------------------------------------- | ------------------ | ------------------------ |
| El criterio no corresponde al tipo de proyecto o a su etapa actual.    | **No aplica**      | No                       |
| El criterio corresponde, pero falta información para evaluarlo.        | **NO VERIFICABLE** | No como incumplimiento   |
| El criterio corresponde y hay evidencia de incumplimiento.             | **FAIL**           | Sí                       |

### Cómo determinar si un criterio aplica

1. Revisar el **TIPO DE ENTREGABLE**, el **BRIEF** y el **CONTEXTO
   ADICIONAL** del formulario.
2. Identificar la **etapa** del proyecto: un criterio de una etapa
   posterior (producción, logística, entrega) no aplica si el proyecto
   aún no ha llegado a ella.
3. Si el brief o los requisitos obligatorios piden explícitamente un
   elemento, el criterio **aplica**, aunque la tabla orientativa diga lo
   contrario.
4. Si no es posible determinar si un criterio aplica, registrarlo como
   **NO VERIFICABLE** e indicar la duda. Nunca asumir que aplica para
   marcarlo como FAIL.

### Tabla orientativa

Referencia inicial; siempre prevalecen el brief y los requisitos
obligatorios.

| Criterio            | Producto nuevo | Reposición de inventario | Pedido especial | Cotización |
| ------------------- | :------------: | :----------------------: | :-------------: | :--------: |
| Brief               | ✓              | ✓                        | ✓               | ✓          |
| Producto            | ✓              | ✓                        | ✓               | ✓          |
| Diseño aprobado     | ✓              | Si cambia el diseño      | ✓               | Si aplica  |
| Especificaciones    | ✓              | ✓                        | ✓               | ✓          |
| Proveedor           | ✓              | ✓                        | ✓               | ✓          |
| Cotización          | ✓              | Si cambia el precio      | ✓               | ✓          |
| Costo               | ✓              | ✓                        | ✓               | ✓          |
| Margen              | ✓              | ✓                        | Si se revende   | ✓          |
| Inventario          | Si se almacena | ✓                        | Si se almacena  | —          |
| Cantidad            | ✓              | ✓                        | ✓               | ✓          |
| Muestra             | ✓              | Si cambia algo           | Si se requiere  | —          |
| Calidad             | ✓              | ✓                        | ✓               | —          |
| Producción          | ✓              | ✓                        | ✓               | —          |
| Fecha comprometida  | ✓              | ✓                        | ✓               | Si aplica  |
| Logística           | ✓              | ✓                        | ✓               | —          |
| Entrega             | ✓              | ✓                        | ✓               | —          |
| Materiales finales  | ✓              | Si cambia el diseño      | ✓               | —          |
| Autorizaciones      | ✓              | ✓                        | ✓               | ✓          |

**—** : normalmente No aplica.

---

## Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Documento** evaluado: brief, cotización, orden de compra, ficha
  técnica, foto de muestra, reporte de inventario, guía de envío,
  acuse de entrega, correo de autorización.
- **Dato concreto**: monto, cantidad, fecha, medida, material, nombre del
  proveedor, número de pedido.
- **Referencia** contra la que se compara: brief, diseño aprobado,
  especificación acordada, presupuesto, fecha comprometida.

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia para comparar, el criterio es **NO VERIFICABLE**
y se indica qué información hizo falta.

Nunca calcular costos, márgenes o cantidades con datos supuestos. Si un
dato necesario no fue proporcionado, el criterio es NO VERIFICABLE.

---

## Resumen de criterios

| #  | Criterio            | Prioridad  |
| -- | ------------------- | ---------- |
| 1  | Brief               | CRÍTICO    |
| 2  | Producto            | CRÍTICO    |
| 3  | Diseño aprobado     | CRÍTICO    |
| 4  | Especificaciones    | CRÍTICO    |
| 5  | Proveedor           | IMPORTANTE |
| 6  | Cotización          | IMPORTANTE |
| 7  | Costo               | IMPORTANTE |
| 8  | Margen              | IMPORTANTE |
| 9  | Inventario          | IMPORTANTE |
| 10 | Cantidad            | IMPORTANTE |
| 11 | Muestra             | IMPORTANTE |
| 12 | Calidad             | CRÍTICO    |
| 13 | Producción          | IMPORTANTE |
| 14 | Fecha comprometida  | CRÍTICO    |
| 15 | Logística           | IMPORTANTE |
| 16 | Entrega             | IMPORTANTE |
| 17 | Materiales finales  | IMPORTANTE |
| 18 | Autorizaciones      | CRÍTICO    |

---

## Criterios

### 1. Brief — CRÍTICO

**Qué se revisa:** que el proyecto responda a lo solicitado: propósito,
producto, cantidades, destinatarios, presupuesto, fechas y restricciones.

**Referencia:** brief o solicitud original.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Cada indicación del brief tiene correspondencia en el proyecto.                                  |
| **WARNING**        | Se cumple el brief, pero alguna indicación se atiende de forma parcial.                          |
| **FAIL**           | Una indicación explícita del brief no se atiende o se contradice. Citar la indicación.           |
| **NO VERIFICABLE** | No se proporcionó brief ni solicitud original.                                                   |

### 2. Producto — CRÍTICO

**Qué se revisa:** que el producto propuesto o producido sea el solicitado
y sea adecuado para su propósito y destinatarios.

**Referencia:** brief, catálogo o solicitud.

| Clasificación      | Evidencia                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **PASS**           | El producto corresponde al solicitado y a su propósito.                                     |
| **WARNING**        | El producto corresponde, pero hay alternativas más adecuadas identificadas y documentadas.  |
| **FAIL**           | El producto es distinto al solicitado o no sirve para el propósito indicado en el brief.    |
| **NO VERIFICABLE** | No se indicó qué producto se esperaba.                                                      |

### 3. Diseño aprobado — CRÍTICO

**Qué se revisa:** que el diseño a aplicar en el producto sea la versión
aprobada y que coincida con lo que se envió o se produjo.

La revisión visual del diseño se realiza con las
[reglas de Diseño](diseno.md) cuando el diseño no llega aprobado.

**Referencia:** diseño aprobado y su autorización.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | El diseño enviado o aplicado coincide con la versión aprobada.                                     |
| **WARNING**        | Coincide, pero hay ajustes menores del proveedor (posición, escala) no documentados.               |
| **FAIL**           | Se envió o aplicó un diseño no aprobado, una versión anterior o uno modificado sin autorización.   |
| **NO VERIFICABLE** | No se proporcionó el diseño aprobado o no hay evidencia de su aprobación.                          |

### 4. Especificaciones — CRÍTICO

**Qué se revisa:** material, medidas, colores, técnica de impresión o
personalización, empaque, acabados y demás características acordadas.

**Referencia:** ficha técnica, brief, orden de compra o cotización aceptada.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Las especificaciones coinciden con lo acordado.                                                    |
| **WARNING**        | Hay especificaciones secundarias sin definir que el proveedor podría interpretar de otra forma.   |
| **FAIL**           | Una especificación no coincide con lo acordado. Indicar lo esperado y lo recibido o cotizado.      |
| **NO VERIFICABLE** | No se proporcionó la ficha técnica ni las especificaciones acordadas.                              |

### 5. Proveedor — IMPORTANTE

**Qué se revisa:** que el proveedor sea el seleccionado o autorizado, con
capacidad para el volumen y la fecha, y con sus datos completos.

**Referencia:** proveedores autorizados, cotizaciones y autorización de selección.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | El proveedor es el autorizado y confirmó capacidad para volumen y fecha.                          |
| **WARNING**        | El proveedor es el autorizado, pero no ha confirmado capacidad o fecha por escrito.               |
| **FAIL**           | Se trabaja con un proveedor distinto al autorizado sin autorización documentada.                  |
| **NO VERIFICABLE** | No se indicó qué proveedor está autorizado ni se proporcionó evidencia de la selección.           |

### 6. Cotización — IMPORTANTE

**Qué se revisa:** que exista cotización formal, vigente, con conceptos
completos (producto, personalización, empaque, envío, impuestos) y que
corresponda a las especificaciones y cantidades solicitadas.

Cuando el procedimiento lo requiera, se revisa también que existan las
cotizaciones comparativas necesarias.

**Referencia:** cotizaciones proporcionadas, brief y especificaciones.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | La cotización es formal, vigente, completa y corresponde a lo solicitado.                         |
| **WARNING**        | La cotización es correcta, pero está por vencer o hay conceptos poco detallados.                  |
| **FAIL**           | La cotización está vencida, no corresponde a las especificaciones o cantidades, u omite conceptos que sí se cobrarán. |
| **NO VERIFICABLE** | No se proporcionó la cotización.                                                                  |

### 7. Costo — IMPORTANTE

**Qué se revisa:** que el costo total y unitario sea consistente con la
cotización y esté dentro del presupuesto autorizado.

**Referencia:** cotización aceptada y presupuesto autorizado.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El costo coincide con la cotización y está dentro del presupuesto.                                    |
| **WARNING**        | El costo está dentro del presupuesto, pero muy cerca del límite o con conceptos variables sin fijar. |
| **FAIL**           | El costo excede el presupuesto autorizado o no coincide con la cotización. Indicar ambos montos.     |
| **NO VERIFICABLE** | No se proporcionó el presupuesto o el costo desglosado.                                               |

### 8. Margen — IMPORTANTE

**Aplica a:** productos que se venden o se cobran internamente con un
precio definido.

**Qué se revisa:** que el margen resultante entre precio y costo cumpla
el margen objetivo definido para el producto o proyecto.

**Referencia:** precio de venta, costo total y margen objetivo.

El margen se calcula con la fórmula que utilice SOC Store. Si no se
indica, el reporte debe mostrar la fórmula utilizada.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El margen calculado cumple el margen objetivo.                                                   |
| **WARNING**        | El margen cumple, pero cualquier variación de costo (envío, merma) lo dejaría por debajo.       |
| **FAIL**           | El margen calculado está por debajo del objetivo. Mostrar precio, costo y cálculo.               |
| **NO VERIFICABLE** | Falta el precio, el costo total o el margen objetivo.                                            |

### 9. Inventario — IMPORTANTE

**Qué se revisa:** existencias actuales, stock mínimo, necesidad real de
producción o reposición y registro de entradas.

**Referencia:** reporte de inventario y stock mínimo definido.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | La producción o reposición se justifica con el inventario actual y queda registrada.                 |
| **WARNING**        | El inventario se consideró, pero la información tiene más de un periodo de antigüedad o no incluye apartados. |
| **FAIL**           | Se produce o repone cuando el inventario disponible cubre la necesidad, o el inventario queda por debajo del mínimo definido. |
| **NO VERIFICABLE** | No se proporcionó el reporte de inventario o no hay stock mínimo definido.                            |

### 10. Cantidad — IMPORTANTE

**Qué se revisa:** que la cantidad cotizada, ordenada, producida y
entregada sea consistente con la solicitada, incluidas las variantes
(tallas, colores, modelos).

**Referencia:** brief, orden de compra y documentos de entrega.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Las cantidades coinciden en todos los documentos y variantes.                                     |
| **WARNING**        | Hay diferencias dentro de la tolerancia acordada con el proveedor.                                |
| **FAIL**           | Las cantidades no coinciden entre documentos o con lo solicitado. Indicar cantidades por documento. |
| **NO VERIFICABLE** | No se proporcionó la cantidad solicitada o los documentos para comparar.                          |

### 11. Muestra — IMPORTANTE

**Aplica a:** productos nuevos, cambios de proveedor, material, técnica
o diseño, y cuando el brief la solicite.

**Qué se revisa:** que exista muestra física o digital, que se haya
revisado contra especificaciones y diseño aprobado, y que esté aprobada
antes de producir.

**Referencia:** muestra (foto o física), especificaciones y aprobación.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | La muestra coincide con especificaciones y diseño, y está aprobada antes de producción.           |
| **WARNING**        | La muestra fue aprobada con observaciones menores que deben confirmarse en producción.            |
| **FAIL**           | Se inició producción sin muestra aprobada cuando era requerida, o la muestra no coincide con lo acordado. |
| **NO VERIFICABLE** | No se proporcionó evidencia de la muestra ni de su aprobación.                                     |

### 12. Calidad — CRÍTICO

**Qué se revisa:** que el producto terminado esté libre de defectos y
coincida con la muestra aprobada: acabados, personalización, color,
costuras, empaque, funcionamiento.

**Referencia:** muestra aprobada, especificaciones y evidencia de revisión
(fotos, reporte de inspección).

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El producto coincide con la muestra aprobada y no se observan defectos.                               |
| **WARNING**        | Hay defectos menores en una proporción baja de piezas, dentro de la tolerancia acordada.             |
| **FAIL**           | Hay defectos que afectan uso o imagen, fuera de tolerancia, o el producto no coincide con la muestra. Indicar tipo y cantidad de piezas afectadas. |
| **NO VERIFICABLE** | No se proporcionaron fotos ni reporte de revisión del producto terminado.                             |

### 13. Producción — IMPORTANTE

**Qué se revisa:** que la producción se haya iniciado con orden de compra
y autorizaciones vigentes, y que su avance sea compatible con la fecha
comprometida.

**Referencia:** orden de compra, calendario del proveedor y reportes de avance.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | La producción está autorizada y su avance es compatible con la fecha comprometida.               |
| **WARNING**        | Hay retraso en el avance que todavía permite cumplir la fecha, o falta reporte de avance reciente. |
| **FAIL**           | La producción inició sin orden o autorización, o el avance hace imposible cumplir la fecha.      |
| **NO VERIFICABLE** | No se proporcionó la orden de compra ni información del avance.                                  |

### 14. Fecha comprometida — CRÍTICO

**Qué se revisa:** que exista una fecha comprometida clara y que el
calendario de producción, logística y entrega permita cumplirla.

**Referencia:** brief, confirmación del proveedor y calendario del proyecto.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | La fecha se cumplió o el calendario confirmado permite cumplirla.                                  |
| **WARNING**        | El calendario permite cumplirla, pero sin margen ante retrasos.                                    |
| **FAIL**           | La fecha no se cumplió o el calendario confirmado no permite cumplirla. Indicar fecha comprometida y fecha real o estimada. |
| **NO VERIFICABLE** | No se indicó fecha comprometida o no hay confirmación del proveedor.                               |

### 15. Logística — IMPORTANTE

**Qué se revisa:** transporte, direcciones de entrega, destinatarios,
distribución por destino, empaque para envío y costo del envío.

**Referencia:** brief, lista de distribución y guías o cotizaciones de envío.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Direcciones, destinatarios, distribución y transporte están definidos y confirmados.             |
| **WARNING**        | Están definidos, pero falta confirmar datos de contacto o algún destino.                         |
| **FAIL**           | Hay direcciones o destinatarios incorrectos, o la distribución no coincide con la lista acordada. |
| **NO VERIFICABLE** | No se proporcionó la lista de distribución ni información de envío.                              |

### 16. Entrega — IMPORTANTE

**Qué se revisa:** que el producto se haya recibido completo, en buen
estado y en el destino correcto, con acuse o evidencia de recepción.

**Referencia:** guías, acuses de recibo, fotos de recepción y lista de distribución.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Hay acuse de recepción completo y en buen estado en todos los destinos.                             |
| **WARNING**        | Falta acuse de algún destino o se reportaron daños menores ya atendidos.                            |
| **FAIL**           | Hay entregas incompletas, en destino incorrecto o con producto dañado sin atender.                  |
| **NO VERIFICABLE** | No se proporcionó evidencia de entrega.                                                             |

### 17. Materiales finales — IMPORTANTE

**Qué se revisa:** que se hayan entregado al proveedor los archivos
finales correctos para producción (vectores, tintas, medidas, plantillas
del proveedor) y que se conserven los archivos del proyecto.

**Referencia:** diseño aprobado y requisitos de archivo del proveedor.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Los archivos finales corresponden al diseño aprobado y cumplen los requisitos del proveedor.        |
| **WARNING**        | Los archivos son correctos, pero la nomenclatura o la organización dificultan identificarlos.      |
| **FAIL**           | Los archivos enviados no corresponden al diseño aprobado o no cumplen los requisitos del proveedor. |
| **NO VERIFICABLE** | No se proporcionaron los archivos enviados ni los requisitos del proveedor.                         |

### 18. Autorizaciones — CRÍTICO

**Qué se revisa:** que existan las autorizaciones requeridas en cada
etapa: presupuesto, proveedor, diseño, muestra, orden de compra y cambios.

**Referencia:** correos, firmas o registros de autorización.

| Clasificación      | Evidencia                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **PASS**           | Cada etapa realizada cuenta con su autorización documentada.                                         |
| **WARNING**        | Las autorizaciones existen, pero alguna es informal (mensaje sin registro) y conviene formalizarla. |
| **FAIL**           | Se avanzó una etapa que requería autorización sin tenerla.                                           |
| **NO VERIFICABLE** | No se proporcionó evidencia de autorizaciones o no está definido quién debe autorizar cada etapa.    |
