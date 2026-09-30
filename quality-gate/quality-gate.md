# SOC Quality Gate — Controlador

Este archivo controla el sistema SOC Quality Gate. Define **cómo** se evalúa un entregable. Las reglas **específicas** de cada gerencia están en `/rules`.

Alcance: entregables de las cuatro gerencias de la Dirección de Posicionamiento.

| Gerencia | Archivo de reglas |
|----------|-------------------|
| Contenido | `rules/contenido.md` |
| Diseño | `rules/diseno.md` |
| Marketing Digital | `rules/marketing-digital.md` |
| SOC Store | `rules/soc-store.md` |

---

## 1. Principios

1. **No inventar información.** Cada juicio se basa en evidencia disponible: la tarjeta de Trello, el brief, los archivos o el historial. Si un dato no está, no se supone.
2. **NO VERIFICABLE no es INCORRECTO.** Si no hay evidencia suficiente para validar un criterio, se marca **NO VERIFICABLE**. Un criterio solo se marca **NO CUMPLE** si hay evidencia de que no se cumple.
3. **No atribuir culpa automáticamente.** Un error, un cambio o una modificación no se atribuye al responsable del entregable sin evidencia. Primero se identifica el **origen** del problema (sección 6).
4. **Citar la evidencia.** Cada hallazgo indica dónde se observó: descripción, comentario, checklist, adjunto, historial de actividad o archivo.
5. **El Quality Gate no aprueba.** Emite un resultado técnico. La aprobación final corresponde a la persona responsable de aprobar.
6. **Separar hechos de interpretación.** Lo observado se reporta como hecho; lo inferido se reporta como posible y se explica por qué.

---

## 2. Estados de evaluación por criterio

Cada criterio evaluado recibe uno de estos estados:

| Estado | Cuándo se usa |
|--------|---------------|
| **CUMPLE** | Hay evidencia de que el criterio se cumple. |
| **NO CUMPLE** | Hay evidencia de que el criterio no se cumple. |
| **NO VERIFICABLE** | No hay evidencia suficiente para afirmar que cumple o que no cumple. |
| **NO APLICA** | El criterio no corresponde a este tipo de entregable. Se explica por qué. |

Si hay duda entre **NO CUMPLE** y **NO VERIFICABLE**, se usa **NO VERIFICABLE** y se dice qué evidencia falta.

---

## 3. Flujo de ejecución

### Paso 1 — Identificar la gerencia responsable

Fuentes, en este orden:

1. Etiqueta, tablero o lista de la tarjeta de Trello.
2. Gerencia indicada en el brief o en la descripción.
3. Tipo de entregable, solo como apoyo; esta fuente sola no basta.

Reglas:

- Si la gerencia no se puede identificar con evidencia, se reporta **gerencia no identificada** y el resultado es **INCOMPLETO**.
- Si en el entregable participan varias gerencias, se identifica la gerencia **responsable principal** y cada componente se evalúa con las reglas de su gerencia.

### Paso 2 — Leer las reglas correspondientes

- Se lee el archivo de `/rules` de cada gerencia involucrada.
- Si el archivo no existe o está vacío, se reporta **reglas no disponibles**. Todos los criterios específicos quedan como **NO VERIFICABLE** y el resultado no puede ser **APROBABLE**.
- Solo se aplican las reglas escritas en el archivo. No se inventan criterios específicos.

### Paso 3 — Analizar la tarjeta de Trello

Se revisa, cuando exista:

| Elemento | Qué se busca |
|----------|--------------|
| Título y descripción | Qué se pidió, para quién y para cuándo |
| Brief (en la descripción o adjunto) | Objetivo, audiencia, mensaje, formato, canal, fecha, KPI |
| Checklists | Componentes solicitados y cuáles están marcados |
| Comentarios | Solicitudes de cambio, aprobaciones, rechazos y aclaraciones |
| Adjuntos | Versiones del entregable y materiales de referencia |
| Etiquetas y miembros | Gerencia, responsables y aprobadores |
| Fechas | Fecha comprometida y fecha real de entrega |
| Historial de actividad | Movimientos entre listas, cambios de fecha, cambios de descripción y reaperturas |

Todo lo que falte en la tarjeta se registra como **información faltante**. No se completa con suposiciones.

### Paso 4 — Analizar los archivos o entregables

- Si hay acceso a los archivos, se revisa la **versión más reciente** y se identifica cuál es.
- Si hay varias versiones, se registran y se comparan cuando ayude a detectar cambios o retrabajo.
- Si no hay acceso a los archivos, se indica explícitamente. Los criterios que dependen del archivo quedan como **NO VERIFICABLE**.

### Paso 5 — Comparar el entregable contra el brief

Se compara lo entregado contra lo solicitado:

| Dimensión | Pregunta |
|-----------|----------|
| Objetivo | ¿El entregable responde al objetivo del brief? |
| Audiencia | ¿Está dirigido a la audiencia definida? |
| Mensaje | ¿Comunica el mensaje solicitado? |
| Formato y medidas | ¿Corresponde al formato, medidas y especificaciones pedidas? |
| Canal | ¿Está adaptado al canal de destino? |
| Componentes | ¿Están todas las piezas o partes solicitadas? |
| CTA | ¿Incluye la llamada a la acción solicitada, si aplica? |
| Fecha | ¿Se entregó en la fecha comprometida? |
| KPI | ¿Tiene un KPI o indicador de éxito asociado? |

Si no hay brief, o el brief no define una dimensión, esa dimensión queda como **NO VERIFICABLE** y el problema se registra con origen **brief** o **información**. No es un error de ejecución.

### Paso 6 — Ejecutar el Quality Gate de la gerencia

- Se aplican los criterios del archivo de reglas de la gerencia.
- Cada criterio recibe un estado (sección 2) y su evidencia.
- Se respeta la clasificación del archivo de reglas entre criterios **críticos** y **no críticos** (sección 8).

### Paso 7 — Clasificar el resultado

Se aplica la sección 4.

### Paso 8 — Identificar correcciones

Por cada criterio con estado **NO CUMPLE** se registra:

- qué debe corregirse;
- evidencia;
- severidad: **crítica** o **no crítica**;
- origen del problema (sección 6);
- quién debe actuar, **solo si hay evidencia**. Si no la hay, se indica **por definir**.

Por cada criterio **NO VERIFICABLE** se registra **qué información o acceso falta** para validarlo.

### Paso 9 — Identificar posible retrabajo

Se aplica la sección 7.

### Paso 10 — Registrar el resultado

Se aplica la sección 9.

---

## 4. Resultados posibles

| Resultado | Significado |
|-----------|-------------|
| **APROBABLE** | El entregable puede pasar a aprobación. |
| **REQUIERE AJUSTES** | El entregable está completo y es evaluable, pero tiene correcciones pendientes. |
| **INCOMPLETO** | No es posible emitir un juicio suficiente: falta información, falta acceso o faltan componentes. |

### Reglas de clasificación

Se evalúan en este orden. La primera que aplica determina el resultado.

1. **INCOMPLETO**, si ocurre cualquiera de estos casos:
   - no se pudo identificar la gerencia;
   - no existe brief o solicitud que permita saber qué se pidió;
   - el entregable o alguno de sus componentes solicitados no está disponible;
   - algún criterio **crítico** está como **NO VERIFICABLE**;
   - no hay reglas disponibles para la gerencia.
2. **REQUIERE AJUSTES**, si algún criterio, crítico o no crítico, está como **NO CUMPLE**.
3. **APROBABLE**, si todos los criterios críticos están como **CUMPLE** o **NO APLICA** y ningún criterio está como **NO CUMPLE**.

Notas:

- Un resultado **INCOMPLETO** también reporta los **NO CUMPLE** que ya se hayan detectado, para adelantar correcciones.
- Un resultado **APROBABLE** puede tener criterios no críticos como **NO VERIFICABLE**. Estos se listan como **pendientes de validar** por quien aprueba.
- **INCOMPLETO** no significa que el trabajo esté mal hecho. Significa que no hay evidencia suficiente para evaluarlo.

---

## 5. Nivel de confianza

Cada resultado indica su nivel de confianza según la evidencia revisada:

| Nivel | Condición |
|-------|-----------|
| **Alta** | Se revisaron el brief, la tarjeta completa y los archivos del entregable. |
| **Media** | Se revisaron el brief y la tarjeta, pero los archivos solo parcialmente o por descripción. |
| **Baja** | La evaluación se basa principalmente en la tarjeta, sin acceso a los archivos. |

---

## 6. Origen de los problemas

Cada hallazgo **NO CUMPLE**, **NO VERIFICABLE** o de retrabajo se clasifica según su origen probable:

| Origen | Descripción | Ejemplo de evidencia |
|--------|-------------|----------------------|
| **Ejecución** | El entregable no cumple lo que el brief pedía con claridad. | El brief pide formato vertical y se entregó horizontal. |
| **Brief** | El brief falta, es ambiguo, está incompleto o se contradice. | El brief no define audiencia ni formato. |
| **Información** | Faltaron insumos necesarios: datos, textos, accesos o materiales. | Un comentario indica que no se recibieron las tasas vigentes. |
| **Aprobación** | La aprobación no ocurrió, fue tardía, estuvo incompleta o la dio alguien sin la atribución. | No hay registro de aprobación del área solicitante. |
| **Cambio estratégico** | Cambió la dirección, prioridad, campaña o posicionamiento después del brief. | Se cambió el mensaje de campaña después de iniciada la producción. |
| **Cambio solicitado** | Alguien pidió modificar algo que ya cumplía el brief original. | Un comentario del solicitante pide otra paleta sobre una pieza ya conforme. |
| **Dependencia externa** | El problema depende de un tercero: proveedor, plataforma, otra área u oficina. | El proveedor de impresión retrasó la entrega. |

Reglas:

- Un problema se clasifica como **ejecución** solo si el brief o la solicitud eran claros **y** hay evidencia de que no se atendieron.
- Si no hay evidencia suficiente para saber el origen, se marca **origen no determinado**. No se asigna por defecto a ejecución.
- Un hallazgo puede tener más de un origen. En ese caso se indica el principal.
- Los cambios solicitados y los cambios estratégicos **no son errores del responsable**, aunque generen correcciones.

---

## 7. Retrabajo

Retrabajo es el trabajo que se rehace sobre algo que ya se había entregado o avanzado.

### Señales de posible retrabajo

- Varias versiones del entregable.
- La tarjeta regresó a una lista anterior o se reabrió.
- Comentarios con solicitudes de cambio después de una entrega.
- Cambios en la descripción o en el brief después de iniciado el trabajo.
- Nuevas fechas de entrega.

### Qué se registra

| Campo | Descripción |
|-------|-------------|
| Ciclos detectados | Número de versiones o devoluciones con evidencia |
| Motivo de cada ciclo | Qué se cambió y por qué |
| Origen | Según la sección 6 |
| Evitable | **Sí**, **No** o **No determinado** |

- El retrabajo cuyo origen es **cambio solicitado**, **cambio estratégico** o **dependencia externa** se registra, pero no se atribuye a la ejecución.
- Si el historial de la tarjeta no está disponible, el retrabajo queda como **NO VERIFICABLE**.

---

## 8. Formato esperado de los archivos de reglas

Cada archivo de `/rules` debe tener sus criterios con:

- **ID** único, por ejemplo `CON-01`, `DIS-01`, `MKT-01` o `STO-01`;
- descripción del criterio;
- tipo: **crítico** o **no crítico**;
- evidencia esperada para validarlo;
- tipos de entregable a los que aplica.

Si un criterio no tiene tipo indicado, se trata como **no crítico**.

---

## 9. Registro del resultado

- Cada ejecución se registra en `/history` con la plantilla `templates/resultado-quality-gate.md`.
- Nombre del archivo: `AAAA-MM-DD_<gerencia>_<id-tarjeta>_<entregable>.md`.
- Si el mismo entregable se evalúa otra vez, se crea un archivo nuevo con sufijo `_v2`, `_v3`, etc. **Los registros anteriores no se sobrescriben.**

### Contenido mínimo del registro

1. **Identificación**: fecha de evaluación, tarjeta de Trello, entregable, gerencia, responsable y versión evaluada.
2. **Fuentes revisadas**: qué se revisó y a qué no hubo acceso.
3. **Nivel de confianza** (sección 5).
4. **Resultado**: APROBABLE, REQUIERE AJUSTES o INCOMPLETO, con el motivo.
5. **Comparación contra el brief** (Paso 5).
6. **Evaluación por criterio**: ID, estado y evidencia.
7. **Correcciones**: qué, severidad, origen y quién debe actuar.
8. **Pendientes NO VERIFICABLE**: qué falta para validar cada uno.
9. **Retrabajo** (sección 7).
10. **Información faltante** en la tarjeta o en el brief.

Si la plantilla está vacía o no existe, se usa este contenido mínimo como estructura del registro.
