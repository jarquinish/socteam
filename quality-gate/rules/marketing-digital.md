# Reglas — Marketing Digital

Reglas del Quality Gate para entregables de la Gerencia de Marketing
Digital: campañas pagadas, anuncios, configuración de audiencias, landing
pages, formularios, flujos de conversión, implementación de medición y
planes de pauta.

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

## Evidencia en Marketing Digital

En esta versión, el Quality Gate **no se conecta** a plataformas de
anuncios, analítica, administradores de etiquetas ni ningún otro servicio.
Sólo se evalúa la evidencia que el equipo proporcione directamente.

Evidencia válida, entre otras:

- Capturas de pantalla de la configuración de la campaña, el conjunto de
  anuncios y los anuncios.
- Exportaciones o tablas de la configuración (audiencias, presupuesto,
  fechas, nomenclatura).
- Vistas previas de los anuncios por ubicación.
- URLs finales completas, incluidos sus parámetros.
- Capturas de herramientas de verificación de etiquetas, eventos y
  conversiones mostrando disparos de prueba.
- Registro de pruebas realizadas (formulario enviado, lead recibido,
  dispositivo y navegador utilizados).
- Plan de medios o documento de presupuesto aprobado.

**Nunca considerar que una implementación técnica funciona sin evidencia
de una prueba.** Que algo esté configurado no demuestra que funcione:
sin evidencia de prueba, el criterio es **NO VERIFICABLE**, no PASS.

### Registro de evidencia

Toda clasificación debe sustentarse con evidencia concreta:

- **Descripción** del elemento evaluado.
- **Ubicación**: campaña, conjunto de anuncios, anuncio, URL, evento o
  captura correspondiente.
- **Referencia** contra la que se compara: brief, plan de medios,
  requisito acordado, especificación de la plataforma o convención
  de nomenclatura.
- **Dato concreto** cuando exista: monto, fecha, parámetro, nombre de
  evento, resultado de la prueba.

Si no se puede citar evidencia, no se asigna FAIL.
Si falta la referencia o la evidencia para comparar, el criterio es
**NO VERIFICABLE** y se indica qué información hizo falta.

### Criterios que no aplican

Cuando un criterio no aplica al entregable (por ejemplo, landing en una
campaña que dirige a mensajería, o pixel en un canal que no lo utiliza),
se registra como **No aplica** y no se considera en el resultado general.
No aplicar no es lo mismo que NO VERIFICABLE.

---

## Resumen de criterios

| #  | Criterio                                     | Prioridad  |
| -- | -------------------------------------------- | ---------- |
| 1  | Objetivo                                     | CRÍTICO    |
| 2  | Audiencia                                    | IMPORTANTE |
| 3  | Segmentación                                 | CRÍTICO    |
| 4  | Plataforma                                   | IMPORTANTE |
| 5  | Copy                                         | IMPORTANTE |
| 6  | Creatividad                                  | IMPORTANTE |
| 7  | CTA                                          | IMPORTANTE |
| 8  | Landing                                      | CRÍTICO    |
| 9  | Coherencia anuncio → landing                 | IMPORTANTE |
| 10 | UTMs                                         | IMPORTANTE |
| 11 | Tracking                                     | CRÍTICO    |
| 12 | Eventos                                      | IMPORTANTE |
| 13 | Conversiones                                 | CRÍTICO    |
| 14 | Presupuesto                                  | CRÍTICO    |
| 15 | Fechas                                       | CRÍTICO    |
| 16 | Naming                                       | DESEABLE   |
| 17 | Pixel o sistema de medición (cuando aplique) | IMPORTANTE |
| 18 | QA previo a publicación                      | CRÍTICO    |

---

## Criterios

### 1. Objetivo — CRÍTICO

**Qué se revisa:** que el objetivo de campaña configurado en la plataforma
corresponda al objetivo de negocio declarado (alcance, tráfico, leads,
conversiones, etc.) y que exista un indicador para medirlo.

**Referencia:** campo OBJETIVO del formulario, brief o plan de medios.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El objetivo configurado corresponde al declarado y tiene un indicador definido.                      |
| **WARNING**        | El objetivo corresponde, pero no se definió el indicador o la meta con la que se medirá.             |
| **FAIL**           | El objetivo configurado es distinto al declarado (por ejemplo, alcance cuando se requieren leads).   |
| **NO VERIFICABLE** | No se indicó el objetivo, o no se proporcionó evidencia de la configuración.                         |

### 2. Audiencia — IMPORTANTE

**Qué se revisa:** que la campaña esté pensada para la audiencia
declarada: mensaje, oferta y etapa del viaje del cliente.

**Referencia:** campo AUDIENCIA del formulario o brief.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | Mensaje y oferta son pertinentes para la audiencia declarada.                                |
| **WARNING**        | Hay elementos del mensaje o de la oferta poco pertinentes para la audiencia.                 |
| **FAIL**           | La campaña está dirigida a una audiencia distinta a la declarada.                            |
| **NO VERIFICABLE** | No se indicó audiencia.                                                                      |

### 3. Segmentación — CRÍTICO

**Qué se revisa:** que la configuración de segmentación en la plataforma
(ubicación geográfica, edad, intereses, listas, audiencias similares,
exclusiones, idioma) refleje la audiencia declarada.

**Referencia:** brief, plan de medios y audiencia declarada.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La segmentación configurada coincide con la audiencia y el plan.                                        |
| **WARNING**        | La segmentación es muy amplia o muy restringida para el objetivo, o faltan exclusiones recomendables.   |
| **FAIL**           | La segmentación contradice lo solicitado (zona, edad, lista o exclusión incorrecta). Indicar el valor esperado y el configurado. |
| **NO VERIFICABLE** | No se proporcionó evidencia de la configuración de segmentación.                                        |

### 4. Plataforma — IMPORTANTE

**Qué se revisa:** que las plataformas y ubicaciones seleccionadas
correspondan al plan, y que las piezas cumplan las especificaciones y
políticas publicitarias de cada plataforma.

**Referencia:** campo CANAL del formulario, plan de medios y
especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Plataformas y ubicaciones coinciden con el plan, y las piezas cumplen sus especificaciones.         |
| **WARNING**        | Hay ubicaciones automáticas no revisadas o piezas no optimizadas para alguna ubicación.            |
| **FAIL**           | La campaña se configuró en una plataforma o ubicación no solicitada, o una pieza incumple una especificación o política de la plataforma. |
| **NO VERIFICABLE** | No se indicó el canal ni se proporcionó evidencia de las ubicaciones.                               |

### 5. Copy — IMPORTANTE

**Qué se revisa:** que los textos del anuncio (título, texto principal,
descripción) coincidan con el copy aprobado y respeten los límites de
caracteres de la plataforma.

La revisión completa del texto se realiza con las
[reglas de Contenido](contenido.md) cuando el copy no llega aprobado.

**Referencia:** copy aprobado y especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | El texto coincide con el copy aprobado y se muestra completo en las ubicaciones.               |
| **WARNING**        | El texto se trunca en alguna ubicación sin perder el mensaje principal.                        |
| **FAIL**           | El texto difiere del aprobado, contiene errores o se trunca perdiendo el mensaje o el CTA.     |
| **NO VERIFICABLE** | No se proporcionó el copy aprobado ni vistas previas del anuncio.                              |

### 6. Creatividad — IMPORTANTE

**Qué se revisa:** que las piezas cargadas sean las aprobadas y se
visualicen correctamente en cada ubicación (recortes, zonas seguras,
duración, formato).

La revisión visual completa se realiza con las
[reglas de Diseño](diseno.md) cuando la pieza no llega aprobada.

**Referencia:** piezas aprobadas y especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Las piezas cargadas son las aprobadas y se visualizan correctamente en las ubicaciones.          |
| **WARNING**        | Alguna ubicación recorta o reduce elementos secundarios de la pieza.                             |
| **FAIL**           | Se cargó una pieza no aprobada o una versión anterior, o una ubicación oculta el mensaje, la marca o el CTA. |
| **NO VERIFICABLE** | No se proporcionaron las piezas aprobadas ni vistas previas por ubicación.                       |

### 7. CTA — IMPORTANTE

**Qué se revisa:** que el botón o llamada a la acción seleccionada en la
plataforma corresponda al objetivo y a lo que ocurre en el destino.

**Referencia:** objetivo, brief y destino del anuncio.

| Clasificación      | Evidencia                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | El CTA corresponde al objetivo y a la acción disponible en el destino.                          |
| **WARNING**        | El CTA es genérico cuando la plataforma ofrece uno más específico para la acción.               |
| **FAIL**           | El CTA promete una acción que el destino no ofrece (por ejemplo, "Registrarse" hacia una página sin formulario). |
| **NO VERIFICABLE** | No se proporcionó evidencia del CTA configurado.                                                |

### 8. Landing — CRÍTICO

**Qué se revisa:** que la página de destino cargue, funcione en
dispositivos móviles y de escritorio, tenga formularios operativos, los
textos legales requeridos y un tiempo de carga razonable.

**Referencia:** brief, requisitos acordados y evidencia de pruebas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La landing carga, se visualiza correctamente en móvil y escritorio, y sus formularios funcionan según la evidencia de prueba. |
| **WARNING**        | La landing funciona, pero tiene carga lenta, elementos desalineados en algún dispositivo o campos de formulario innecesarios. |
| **FAIL**           | La landing no carga, muestra errores, el formulario no envía o faltan textos legales requeridos.       |
| **NO VERIFICABLE** | No se proporcionó la URL o no hay evidencia de pruebas de funcionamiento.                              |

### 9. Coherencia anuncio → landing — IMPORTANTE

**Qué se revisa:** que la landing continúe lo que promete el anuncio:
mismo mensaje, misma oferta, mismas condiciones y consistencia visual.

**Referencia:** anuncio y landing.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Mensaje, oferta y estilo visual del anuncio se reconocen de inmediato en la landing.                |
| **WARNING**        | La oferta coincide, pero el mensaje o el estilo visual cambian notablemente.                        |
| **FAIL**           | La landing no contiene la oferta del anuncio, o presenta condiciones, precios o datos distintos.    |
| **NO VERIFICABLE** | No se proporcionó el anuncio o la landing para comparar.                                            |

### 10. UTMs — IMPORTANTE

**Qué se revisa:** que las URLs de destino incluyan los parámetros UTM
requeridos, con valores correctos y consistentes con la convención acordada.

**Referencia:** convención de UTMs acordada y URLs finales.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Todas las URLs tienen los parámetros requeridos con valores correctos.                                  |
| **WARNING**        | Hay valores inconsistentes entre anuncios (mayúsculas, separadores, abreviaturas).                      |
| **FAIL**           | Faltan parámetros requeridos, tienen valores incorrectos o rompen la URL. Citar la URL.                 |
| **NO VERIFICABLE** | No se proporcionaron las URLs finales. Si no hay convención acordada, sólo puede evaluarse consistencia (PASS o WARNING). |

### 11. Tracking — CRÍTICO

**Qué se revisa:** que exista un plan de medición y que la campaña
permita atribuir resultados: qué se mide, con qué herramienta y cómo se
conecta la campaña con los resultados.

**Referencia:** brief, plan de medición y objetivo.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Existe plan de medición y hay evidencia de prueba de que los resultados se registran y atribuyen.    |
| **WARNING**        | Se registran los resultados principales, pero faltan mediciones secundarias del plan.                |
| **FAIL**           | No es posible medir el objetivo de la campaña con la implementación actual, según la evidencia.      |
| **NO VERIFICABLE** | No se proporcionó plan de medición ni evidencia de prueba.                                            |

### 12. Eventos — IMPORTANTE

**Qué se revisa:** que los eventos definidos (vista de página, clic,
inicio de formulario, envío, etc.) se disparen una sola vez, en el
momento correcto y con los parámetros esperados.

**Referencia:** plan de medición y evidencia de disparos de prueba.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | Cada evento definido se dispara correctamente según la evidencia de prueba.                            |
| **WARNING**        | Los eventos se disparan, pero faltan parámetros secundarios o nombres consistentes.                    |
| **FAIL**           | Un evento definido no se dispara, se duplica o se dispara en un momento incorrecto.                    |
| **NO VERIFICABLE** | No se proporcionó evidencia de disparos de prueba.                                                     |

### 13. Conversiones — CRÍTICO

**Qué se revisa:** que la conversión principal de la campaña esté
configurada, asociada al evento correcto, seleccionada como objetivo de
optimización y registrada en una prueba.

**Referencia:** objetivo, plan de medición y evidencia de prueba.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La conversión principal está configurada, asociada al evento correcto y registrada en una prueba.      |
| **WARNING**        | La conversión funciona, pero hay conversiones secundarias sin configurar o con valor no asignado.      |
| **FAIL**           | La conversión principal no existe, está asociada a un evento incorrecto o la campaña optimiza hacia otra acción. |
| **NO VERIFICABLE** | No se proporcionó evidencia de la configuración ni de una prueba de conversión.                        |

### 14. Presupuesto — CRÍTICO

**Qué se revisa:** monto total, tipo de presupuesto (diario o total),
distribución entre campañas, conjuntos o plataformas, y moneda.

**Referencia:** plan de medios o presupuesto aprobado.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | Monto, tipo y distribución coinciden con el presupuesto aprobado.                                      |
| **WARNING**        | El total coincide, pero la distribución concentra o dispersa la inversión de forma poco eficiente para el objetivo. |
| **FAIL**           | El monto, tipo, moneda o distribución no coinciden con lo aprobado. Indicar monto esperado y configurado. |
| **NO VERIFICABLE** | No se proporcionó el presupuesto aprobado o la evidencia de la configuración.                          |

### 15. Fechas — CRÍTICO

**Qué se revisa:** fechas y horarios de inicio y fin, zona horaria,
programación y su alineación con la vigencia de la oferta y la
disponibilidad de la landing.

**Referencia:** brief, plan de medios y vigencia de la oferta.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Fechas, horarios y zona horaria coinciden con lo solicitado y con la vigencia de la oferta.          |
| **WARNING**        | Las fechas coinciden, pero no se definió fecha de fin o hay poco margen antes del lanzamiento.       |
| **FAIL**           | Las fechas no coinciden con lo solicitado, la zona horaria es incorrecta o la campaña corre fuera de la vigencia de la oferta. |
| **NO VERIFICABLE** | No se indicaron las fechas requeridas o no se proporcionó evidencia de la configuración.             |

### 16. Naming — DESEABLE

**Qué se revisa:** que campañas, conjuntos de anuncios, anuncios,
audiencias y eventos sigan la convención de nomenclatura acordada.

**Referencia:** convención de nomenclatura acordada.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | Todos los nombres siguen la convención.                                                      |
| **WARNING**        | Hay nombres que se apartan de la convención o son inconsistentes entre sí.                  |
| **FAIL**           | Los nombres no siguen la convención acordada e impiden identificar la campaña en reportes.   |
| **NO VERIFICABLE** | No se proporcionaron los nombres. Si no hay convención acordada, sólo puede evaluarse consistencia (PASS o WARNING). |

### 17. Pixel o sistema de medición (cuando aplique) — IMPORTANTE

**Aplica a:** campañas cuyo destino es un sitio o landing propia y cuya
medición depende de un pixel, etiqueta o sistema de medición instalado.

**Qué se revisa:** que el pixel o sistema de medición correcto esté
instalado en todas las páginas del flujo, que corresponda a la cuenta
correcta y que esté activo.

**Referencia:** plan de medición y evidencia de verificación.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El pixel correcto está instalado en todas las páginas del flujo y activo, según la evidencia.        |
| **WARNING**        | El pixel está activo, pero hay advertencias de diagnóstico en la plataforma.                         |
| **FAIL**           | Falta el pixel en alguna página del flujo, está duplicado o pertenece a otra cuenta.                 |
| **NO VERIFICABLE** | No se proporcionó evidencia de la instalación o verificación.                                        |

### 18. QA previo a publicación — CRÍTICO

**Qué se revisa:** que se haya realizado una revisión completa antes de
publicar: vistas previas por ubicación, ligas probadas, formulario enviado,
lead recibido en el destino esperado, pruebas en móvil y escritorio.

**Referencia:** evidencia de QA proporcionada por el equipo.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Hay evidencia de QA completo del flujo, de extremo a extremo.                                        |
| **WARNING**        | Hay evidencia de QA, pero no cubre todos los dispositivos, ubicaciones o variantes del anuncio.      |
| **FAIL**           | La evidencia de QA muestra un error sin corregir en el flujo (liga rota, formulario que no envía, lead que no llega). |
| **NO VERIFICABLE** | No se proporcionó evidencia de QA.                                                                   |
