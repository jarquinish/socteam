# Reglas — SOC Store

> **SOC QUALITY GATE — CRITERIOS V1 — PROPUESTA DE DIRECCIÓN**
> Estado: **PENDIENTE DE CALIBRACIÓN CON GERENTES.**

Reglas del Quality Gate para entregables de SOC Store: desarrollo de
productos, artículos promocionales, pedidos de producción, reposición de
inventario, cotizaciones, órdenes a proveedores y entregas.

Estas reglas se aplican dentro del flujo y las reglas comunes definidas en
[`quality-gate.md`](../quality-gate.md): clasificación, importancia, N/A,
regla de escalamiento, resultado general y proporcionalidad.

---

## Cómo usar estas reglas

1. Identificar el **tipo de proyecto** y la **etapa** en que se encuentra.
2. Aplicar la [Regla de contexto](../quality-gate.md#regla-de-contexto)
   y determinar qué criterios aplican (ver
   [Aplicabilidad](#aplicabilidad-según-el-tipo-de-proyecto)).
   Los que no aplican son **N/A**.
3. Evaluar cada criterio aplicable: **PASS**, **WARNING**, **FAIL** o
   **NO VERIFICABLE**.
4. Registrar la **evidencia** que sustenta la clasificación.
5. Usar la importancia por defecto de cada criterio, salvo que el
   contexto justifique ajustarla (explicarlo en el reporte).

---

## Aplicabilidad según el tipo de proyecto

Los proyectos de SOC Store varían mucho entre sí. Una reposición de
inventario no requiere muestra; una cotización todavía no tiene
producción ni logística.

**No marcar como error información que simplemente no corresponda al
tipo de proyecto.**

| Situación                                                              | Cómo se registra   | ¿Cuenta en el resultado? |
| ---------------------------------------------------------------------- | ------------------ | ------------------------ |
| El criterio no corresponde al tipo de proyecto o a su etapa actual.    | **N/A**            | No                       |
| El criterio corresponde, pero falta información para evaluarlo.        | **NO VERIFICABLE** | No como incumplimiento   |
| El criterio corresponde y hay evidencia de incumplimiento.             | **FAIL**           | Sí                       |

### Cómo determinar si un criterio aplica

1. Revisar el **TIPO DE ENTREGABLE**, el **BRIEF** y el **CONTEXTO
   ADICIONAL** del formulario.
2. Identificar la **etapa** del proyecto: un criterio de una etapa
   posterior (producción, logística) no aplica si el proyecto aún no ha
   llegado a ella.
3. Si el brief o los requisitos obligatorios piden explícitamente un
   elemento, el criterio **aplica**, aunque la tabla orientativa diga lo
   contrario.
4. Si no es posible determinar si un criterio aplica, registrarlo como
   **NO VERIFICABLE** e indicar la duda. Nunca asumir que aplica para
   marcarlo como FAIL.

### Tabla orientativa

Referencia inicial; siempre prevalecen el brief y los requisitos
obligatorios. Los tipos de proyecto están pendientes de validación con
la gerencia.

| Criterio                | Producto nuevo | Reposición de inventario | Pedido especial | Cotización |
| ----------------------- | :------------: | :----------------------: | :-------------: | :--------: |
| Producto correcto       | ✓              | ✓                        | ✓               | ✓          |
| Especificaciones        | ✓              | ✓                        | ✓               | ✓          |
| Diseño aprobado         | ✓              | Si cambia el diseño      | Si lleva arte   | Si aplica  |
| Cotización              | ✓              | Si cambia el precio      | ✓               | ✓          |
| Costo autorizado        | ✓              | ✓                        | ✓               | ✓          |
| Cantidad                | ✓              | ✓                        | ✓               | ✓          |
| Calidad física          | ✓              | ✓                        | ✓               | N/A        |
| Fecha comprometida      | ✓              | ✓                        | ✓               | Si aplica  |
| Autorizaciones          | ✓              | ✓                        | ✓               | ✓          |
| Branding SOC            | Si usa marca   | Si usa marca             | Si usa marca    | Si usa marca |
| Proveedor validado      | ✓              | ✓                        | ✓               | ✓          |
| Margen                  | Si se revende  | Si se revende            | Si se revende   | Si se revende |
| Inventario              | Si se almacena | ✓                        | Si se almacena  | N/A        |
| Muestra / prueba        | ✓              | Si cambia algo           | Si se justifica | N/A        |
| Producción              | ✓              | ✓                        | ✓               | N/A        |
| Logística               | ✓              | ✓                        | ✓               | N/A        |

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

| #  | Criterio                | Importancia por defecto  |
| -- | ----------------------- | ------------------------ |
| 1  | Producto correcto       | CRÍTICO                  |
| 2  | Especificaciones        | CRÍTICO                  |
| 3  | Diseño aprobado         | CRÍTICO (condicional)    |
| 4  | Cotización              | CRÍTICO (condicional)    |
| 5  | Costo autorizado        | CRÍTICO                  |
| 6  | Cantidad                | CRÍTICO                  |
| 7  | Calidad física          | CRÍTICO (condicional)    |
| 8  | Fecha comprometida      | CRÍTICO                  |
| 9  | Autorizaciones          | CRÍTICO                  |
| 10 | Branding SOC            | CRÍTICO (condicional)    |
| 11 | Proveedor validado      | IMPORTANTE               |
| 12 | Margen                  | IMPORTANTE (condicional) |
| 13 | Inventario              | IMPORTANTE (condicional) |
| 14 | Muestra / prueba        | IMPORTANTE (condicional) |
| 15 | Producción              | IMPORTANTE (condicional) |
| 16 | Logística               | IMPORTANTE (condicional) |

**Condicional:** el criterio sólo aplica en los casos indicados en su
ficha y en la tabla orientativa; en los demás es N/A.

---

## CRÍTICOS

### 1. Producto correcto — CRÍTICO

**Qué se revisa:** que el producto propuesto o producido coincida con la
solicitud y responda a lo indicado en el brief: propósito,
destinatarios, restricciones.

**Referencia:** brief, solicitud original o catálogo.

| Clasificación      | Evidencia                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **PASS**           | El producto coincide con la solicitud y con su propósito.                                   |
| **WARNING**        | Coincide, pero hay alternativas más adecuadas identificadas y documentadas, o alguna indicación secundaria del brief se atiende de forma parcial. |
| **FAIL**           | El producto es distinto al solicitado, no sirve para el propósito indicado o contradice una indicación esencial del brief. |
| **NO VERIFICABLE** | No se proporcionó brief ni solicitud que indique qué producto se esperaba.                  |

### 2. Especificaciones — CRÍTICO

**Qué se revisa, cuando corresponda:** material, medidas, color,
cantidad por variante, acabado, técnica de personalización, empaque y
demás características acordadas.

**Referencia:** ficha técnica, brief, orden de compra o cotización aceptada.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Las especificaciones coinciden con lo acordado.                                                    |
| **WARNING**        | Hay especificaciones secundarias sin definir que el proveedor podría interpretar de otra forma.   |
| **FAIL**           | Una especificación no coincide con lo acordado. Indicar lo esperado y lo recibido o cotizado.      |
| **NO VERIFICABLE** | No se proporcionó la ficha técnica ni las especificaciones acordadas.                              |

### 3. Diseño aprobado — CRÍTICO (condicional)

**Aplica cuando:** el producto requiere arte. Si no lleva arte, es N/A.

**Qué se revisa:** no considerar listo para producción un producto que
requiera arte y no tenga la aprobación correspondiente. Incluye que el
diseño aplicado sea la versión aprobada y que los **materiales finales**
entregados al proveedor (vectores, tintas, medidas, plantillas del
proveedor) correspondan a esa versión.

La revisión visual del diseño se realiza con las
[reglas de Diseño](diseno.md) cuando el diseño no llega aprobado.

**Referencia:** diseño aprobado, su autorización y requisitos de archivo
del proveedor.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | Existe aprobación y el diseño y los archivos enviados coinciden con la versión aprobada.          |
| **WARNING**        | Coincide, pero hay ajustes menores del proveedor (posición, escala) no documentados, o la nomenclatura de archivos dificulta identificarlos. |
| **FAIL**           | El producto pasa a producción sin arte aprobado, o se envió un diseño no aprobado, una versión anterior, uno modificado sin autorización o archivos que no cumplen los requisitos del proveedor. |
| **NO VERIFICABLE** | No se proporcionó el diseño aprobado, la evidencia de aprobación o los archivos enviados.          |

### 4. Cotización — CRÍTICO (condicional)

**Aplica cuando:** existe un costo que debe respaldarse. Si el producto
proviene de inventario existente sin compra, es N/A.

**Qué se revisa:** que exista respaldo del costo: cotización formal,
vigente, con conceptos completos (producto, personalización, empaque,
envío, impuestos), que corresponda a las especificaciones y cantidades.
Cuando el procedimiento lo requiera, que existan cotizaciones comparativas.

**Referencia:** cotizaciones proporcionadas, brief y especificaciones.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | La cotización es formal, vigente, completa y corresponde a lo solicitado.                         |
| **WARNING**        | Es correcta, pero está por vencer o hay conceptos poco detallados.                                |
| **FAIL**           | No existe respaldo del costo, la cotización está vencida, no corresponde a especificaciones o cantidades, u omite conceptos que sí se cobrarán. |
| **NO VERIFICABLE** | No se proporcionó la cotización.                                                                  |

### 5. Costo autorizado — CRÍTICO

**Qué se revisa:** que el costo total y unitario no exceda lo autorizado
sin aprobación, y que sea consistente con la cotización.

**Referencia:** cotización aceptada y presupuesto autorizado.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El costo está dentro de lo autorizado y coincide con la cotización.                                   |
| **WARNING**        | Está dentro de lo autorizado, pero muy cerca del límite o con conceptos variables sin fijar.         |
| **FAIL**           | El costo excede lo autorizado sin aprobación, o no coincide con la cotización. Indicar ambos montos. |
| **NO VERIFICABLE** | No se proporcionó el monto autorizado o el costo desglosado.                                          |

### 6. Cantidad — CRÍTICO

**Qué se revisa:** que la cantidad coincida con la solicitud, la orden o
la autorización, en todos los documentos y variantes (tallas, colores,
modelos).

**Referencia:** brief, orden de compra, autorización y documentos de entrega.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | Las cantidades coinciden en todos los documentos y variantes.                                     |
| **WARNING**        | Hay diferencias dentro de la tolerancia acordada con el proveedor.                                |
| **FAIL**           | Las cantidades no coinciden con la solicitud, la orden o la autorización. Indicar cantidad por documento. |
| **NO VERIFICABLE** | No se proporcionó la cantidad solicitada o los documentos para comparar.                          |

### 7. Calidad física — CRÍTICO (condicional)

**Aplica cuando:** existe producto físico que pueda verificarse. En
etapas previas a producción, es N/A.

**Qué se revisa:** que el producto cumpla especificaciones y coincida
con la muestra aprobada: acabados, personalización, color, costuras,
empaque, funcionamiento, estado al recibirse.

**Referencia:** muestra aprobada, especificaciones y evidencia de revisión
(fotos, reporte de inspección, acuse de recepción).

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El producto cumple especificaciones y coincide con la muestra; no se observan defectos.               |
| **WARNING**        | Hay defectos menores en una proporción baja de piezas, dentro de la tolerancia acordada.             |
| **FAIL**           | Hay defectos que afectan uso o imagen, fuera de tolerancia, o el producto no coincide con la muestra. Indicar tipo y cantidad de piezas afectadas. |
| **NO VERIFICABLE** | No se proporcionaron fotos ni reporte de revisión del producto terminado.                             |

### 8. Fecha comprometida — CRÍTICO

**Qué se revisa:** que exista una fecha comprometida clara y que permita
cumplir el objetivo para el que se solicita el producto (evento,
campaña, entrega a oficinas), considerando producción y logística.

**Referencia:** brief, confirmación del proveedor y calendario del proyecto.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | La fecha se cumplió o el calendario confirmado permite cumplirla antes de que se necesite el producto. |
| **WARNING**        | El calendario permite cumplirla, pero sin margen ante retrasos.                                    |
| **FAIL**           | La fecha no se cumplió o el calendario confirmado no permite tener el producto a tiempo para su objetivo. Indicar fecha comprometida y fecha real o estimada. |
| **NO VERIFICABLE** | No se indicó fecha comprometida o no hay confirmación del proveedor.                               |

### 9. Autorizaciones — CRÍTICO

**Qué se revisa:** que existan las aprobaciones necesarias según el
proceso: presupuesto, proveedor, diseño, muestra, orden de compra y cambios.

**Referencia:** correos, firmas o registros de autorización.

| Clasificación      | Evidencia                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **PASS**           | Cada etapa realizada cuenta con su autorización documentada.                                         |
| **WARNING**        | Las autorizaciones existen, pero alguna es informal (mensaje sin registro) y conviene formalizarla. |
| **FAIL**           | Se avanzó una etapa que requería autorización sin tenerla.                                           |
| **NO VERIFICABLE** | No se proporcionó evidencia de autorizaciones o no está definido quién debe autorizar cada etapa.    |

### 10. Branding SOC — CRÍTICO (condicional)

**Aplica cuando:** el producto utiliza la marca SOC. Si no, es N/A.

**Qué se revisa:** que la aplicación de la marca respete los lineamientos
aplicables: versión del logo, color, proporción, área de protección y
técnica de aplicación compatible con el Brandbook.

**Referencia:** Brandbook SOC y lineamientos de aplicación en productos.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | La marca se aplica conforme a los lineamientos.                                                     |
| **WARNING**        | La aplicación es correcta, pero la técnica o el material reducen su visibilidad o fidelidad de color. |
| **FAIL**           | La marca se aplica en versión, color o proporción no permitidos, o contradice los lineamientos.     |
| **NO VERIFICABLE** | No se dispone de los lineamientos aplicables o de evidencia de la aplicación.                       |

---

## IMPORTANTES

### 11. Proveedor validado — IMPORTANTE

**Qué se revisa, cuando exista evidencia:** que el proveedor sea el
seleccionado o autorizado, con capacidad para el volumen y la fecha, y
condiciones claras (pago, entrega, tolerancias).

**Referencia:** proveedores autorizados, cotizaciones y autorización de selección.

| Clasificación      | Evidencia                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **PASS**           | El proveedor está autorizado y confirmó capacidad y condiciones.                                  |
| **WARNING**        | Está autorizado, pero no ha confirmado capacidad, fecha o condiciones por escrito.                |
| **FAIL**           | Se trabaja con un proveedor distinto al autorizado sin autorización documentada.                  |
| **NO VERIFICABLE** | No se indicó qué proveedor está autorizado ni se proporcionó evidencia de su capacidad.           |

### 12. Margen — IMPORTANTE (condicional)

**Aplica únicamente cuando:** el producto o proceso requiere evaluación
de rentabilidad (producto que se vende o se cobra con precio definido).
Si no, es N/A.

**Qué se revisa:** que el margen resultante entre precio y costo cumpla
el margen objetivo definido.

El margen se calcula con la fórmula que utilice SOC Store. Si no se
indica, el reporte debe mostrar la fórmula utilizada.

**Referencia:** precio de venta, costo total y margen objetivo.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | El margen calculado cumple el margen objetivo.                                                   |
| **WARNING**        | Cumple, pero cualquier variación de costo (envío, merma) lo dejaría por debajo.                 |
| **FAIL**           | El margen calculado está por debajo del objetivo. Mostrar precio, costo y cálculo.               |
| **NO VERIFICABLE** | Falta el precio, el costo total o el margen objetivo.                                            |

### 13. Inventario — IMPORTANTE (condicional)

**Aplica cuando:** el proyecto depende de existencias o genera
inventario. Si no, es N/A.

**Qué se revisa:** disponibilidad, existencias actuales, stock mínimo,
necesidad real de producción o reposición y registro de entradas.

**Referencia:** reporte de inventario y stock mínimo definido.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | La disponibilidad está confirmada y la producción o reposición se justifica con el inventario actual. |
| **WARNING**        | El inventario se consideró, pero la información está desactualizada o no incluye apartados.          |
| **FAIL**           | Se produce o repone cuando el inventario cubre la necesidad, se compromete producto sin disponibilidad, o el inventario queda por debajo del mínimo definido. |
| **NO VERIFICABLE** | No se proporcionó el reporte de inventario o no hay stock mínimo definido.                            |

### 14. Muestra / prueba — IMPORTANTE (condicional)

**Aplica cuando:** el tipo de producción justifica una muestra: producto
nuevo, cambio de proveedor, material, técnica o diseño, o cuando el brief
la solicite. Si no, es N/A.

**Qué se revisa:** que exista muestra física o digital, revisada contra
especificaciones y diseño aprobado, y aprobada antes de producir.

**Referencia:** muestra (foto o física), especificaciones y aprobación.

| Clasificación      | Evidencia                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **PASS**           | La muestra coincide con especificaciones y diseño, y está aprobada antes de producción.           |
| **WARNING**        | Fue aprobada con observaciones menores que deben confirmarse en producción.                       |
| **FAIL**           | Se inició producción sin muestra aprobada cuando era requerida, o la muestra no coincide con lo acordado. |
| **NO VERIFICABLE** | No se proporcionó evidencia de la muestra ni de su aprobación.                                     |

### 15. Producción — IMPORTANTE (condicional)

**Aplica cuando:** el proyecto está en producción o ya la concluyó. En
etapas previas, es N/A.

**Qué se revisa, cuando exista información:** condiciones de producción
(orden de compra, autorizaciones vigentes) y seguimiento del avance
compatible con la fecha comprometida.

**Referencia:** orden de compra, calendario del proveedor y reportes de avance.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | La producción está autorizada y su seguimiento muestra avance compatible con la fecha.           |
| **WARNING**        | Hay retraso que todavía permite cumplir la fecha, o falta reporte de avance reciente.            |
| **FAIL**           | La producción inició sin orden o autorización, o el avance hace imposible cumplir la fecha.      |
| **NO VERIFICABLE** | No se proporcionó la orden de compra ni información del avance.                                  |

### 16. Logística — IMPORTANTE (condicional)

**Aplica cuando:** el producto debe enviarse o distribuirse. Si no, es N/A.

**Qué se revisa:** claridad suficiente sobre entrega y destino:
transporte, direcciones, destinatarios, distribución por destino,
empaque para envío, costo del envío y, una vez entregado, evidencia de
recepción completa y en buen estado.

**Referencia:** brief, lista de distribución, guías, cotizaciones de envío
y acuses de recibo.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Entrega y destinos están definidos y confirmados; si ya se entregó, hay acuse completo.          |
| **WARNING**        | Están definidos, pero falta confirmar datos de contacto, algún destino o algún acuse.            |
| **FAIL**           | Hay direcciones o destinatarios incorrectos, la distribución no coincide con la lista acordada, o hay entregas incompletas o en destino incorrecto sin atender. |
| **NO VERIFICABLE** | No se proporcionó la lista de distribución ni información de envío o entrega.                    |
