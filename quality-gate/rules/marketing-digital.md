# Reglas — Marketing Digital

> **SOC QUALITY GATE — CRITERIOS V1 — PROPUESTA DE DIRECCIÓN**
> Estado: **PENDIENTE DE CALIBRACIÓN CON GERENTES.**

Reglas del Quality Gate para entregables de la Gerencia de Marketing
Digital: campañas pagadas, anuncios, configuración de audiencias, landing
pages, formularios, flujos de conversión, implementación de medición,
planes de pauta y proyectos SEO.

Estas reglas se aplican dentro del flujo y las reglas comunes definidas en
[`quality-gate.md`](../quality-gate.md): clasificación, importancia, N/A,
regla de escalamiento, resultado general y proporcionalidad.

---

## Calidad de implementación vs. performance

Separar siempre:

| Calidad de implementación                                      | Performance                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| ¿La campaña está correctamente planteada y configurada?        | ¿Qué resultados obtuvo la campaña?                           |
| Se evalúa **antes** de publicar, en este Quality Gate.         | Se evalúa **después**, en el seguimiento de desempeño.       |

Una campaña correctamente configurada puede tener bajo performance. Eso
no convierte automáticamente en incorrecto el Quality Gate original.

Ver [Performance](#performance) al final de este documento.

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
- Plan de medición: qué se mide, con qué herramienta y qué evento o
  conversión corresponde al objetivo.
- Capturas de herramientas de verificación de etiquetas, eventos y
  conversiones mostrando disparos de prueba.
- Registro de pruebas realizadas (formulario enviado, lead recibido,
  dispositivo y navegador utilizados).
- Plan de medios o documento de presupuesto aprobado.

### Planteamiento vs. implementación

- Si el entregable es un **plan** (campaña aún no implementada), basta
  con que la medición, los eventos y las conversiones estén **correctamente
  definidos** para un PASS.
- Si el entregable es una **implementación** lista para publicar, se
  requiere **evidencia de prueba**. Que algo esté configurado no demuestra
  que funcione: sin evidencia de prueba, el criterio es
  **NO VERIFICABLE**, no PASS.

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

---

## Resumen de criterios

| #  | Criterio                          | Importancia por defecto  |
| -- | --------------------------------- | ------------------------ |
| 1  | Objetivo de campaña               | CRÍTICO                  |
| 2  | Tracking                          | CRÍTICO (condicional)    |
| 3  | Conversión / evento               | CRÍTICO (condicional)    |
| 4  | Landing funcional                 | CRÍTICO (condicional)    |
| 5  | Coherencia anuncio → landing      | CRÍTICO (condicional)    |
| 6  | Presupuesto autorizado            | CRÍTICO                  |
| 7  | Fechas                            | CRÍTICO                  |
| 8  | UTMs                              | CRÍTICO (condicional)    |
| 9  | QA previo a publicación           | CRÍTICO                  |
| 10 | Segmentación                      | IMPORTANTE               |
| 11 | Copy                              | IMPORTANTE               |
| 12 | Creatividad                       | IMPORTANTE               |
| 13 | CTA                               | IMPORTANTE               |
| 14 | Naming                            | IMPORTANTE               |
| 15 | SEO                               | IMPORTANTE (condicional) |

**Condicional:** el criterio sólo aplica en los casos indicados en su
ficha; en los demás es N/A.

---

## CRÍTICOS

### 1. Objetivo de campaña — CRÍTICO

**Qué se revisa:** que el objetivo de campaña esté claramente definido,
que el objetivo configurado en la plataforma corresponda al objetivo de
negocio (alcance, tráfico, leads, conversiones, etc.) y que exista un
indicador para medirlo.

**Referencia:** campo OBJETIVO del formulario, brief o plan de medios.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | El objetivo está definido, el configurado corresponde al declarado y tiene un indicador.              |
| **WARNING**        | El objetivo corresponde, pero no se definió el indicador o la meta con la que se medirá.             |
| **FAIL**           | No hay objetivo definido, o el configurado es distinto al declarado (por ejemplo, alcance cuando se requieren leads). |
| **NO VERIFICABLE** | No se proporcionó evidencia de la configuración.                                                      |

### 2. Tracking — CRÍTICO (condicional)

**Aplica cuando:** el objetivo requiere medir resultados en un sitio,
landing o plataforma. Si no, es N/A.

**Qué se revisa:** que la medición necesaria esté correctamente
planteada: qué se mide, con qué herramienta, y cómo se conecta la
campaña con los resultados. Incluye que el **pixel o sistema de
medición** correcto esté instalado en todas las páginas del flujo,
corresponda a la cuenta correcta y esté activo.

**Referencia:** brief, plan de medición y evidencia de verificación.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | La medición está correctamente planteada y, si ya está implementada, hay evidencia de que registra y atribuye resultados. |
| **WARNING**        | Se miden los resultados principales, pero faltan mediciones secundarias o hay advertencias de diagnóstico. |
| **FAIL**           | No es posible medir el objetivo con lo planteado o implementado; falta el pixel en alguna página del flujo, está duplicado o pertenece a otra cuenta. |
| **NO VERIFICABLE** | No se proporcionó plan de medición ni evidencia de instalación o prueba.                              |

### 3. Conversión / evento — CRÍTICO (condicional)

**Aplica cuando:** es necesario medir una acción para evaluar el
objetivo. Si no, es N/A.

**Qué se revisa:** que exista la definición o configuración correcta de
la conversión principal y de los eventos necesarios (vista de página,
clic, inicio de formulario, envío): asociados a la acción correcta,
disparados una sola vez, en el momento correcto y, cuando aplique,
seleccionados como objetivo de optimización.

**Referencia:** objetivo, plan de medición y evidencia de disparos de prueba.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La conversión y los eventos están correctamente definidos y, si ya están implementados, se registran en una prueba. |
| **WARNING**        | Funcionan, pero faltan parámetros, conversiones secundarias o nombres consistentes.                    |
| **FAIL**           | La conversión principal no existe, está asociada a una acción incorrecta, un evento no se dispara o se duplica, o la campaña optimiza hacia otra acción. |
| **NO VERIFICABLE** | No se proporcionó la definición ni evidencia de configuración o prueba.                                |

### 4. Landing funcional — CRÍTICO (condicional)

**Aplica cuando:** existe landing. Si la campaña dirige a otro destino
(mensajería, perfil, formulario nativo), es N/A.

**Qué se revisa:** que la landing cargue, funcione en móvil y escritorio,
permita la acción esperada, tenga formularios operativos y los textos
legales requeridos.

**Referencia:** brief, requisitos acordados y evidencia de pruebas.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La landing carga, funciona en móvil y escritorio, y permite la acción esperada según la evidencia de prueba. |
| **WARNING**        | Funciona, pero tiene carga lenta, elementos desalineados en algún dispositivo o campos innecesarios.   |
| **FAIL**           | La landing no carga, muestra errores, no permite la acción esperada o faltan textos legales requeridos. |
| **NO VERIFICABLE** | No se proporcionó la URL o no hay evidencia de pruebas de funcionamiento.                              |

### 5. Coherencia anuncio → landing — CRÍTICO (condicional)

**Aplica cuando:** existe un destino propio (landing o sitio). Si no, es N/A.

**Qué se revisa:** que la promesa, el mensaje y la acción del anuncio
mantengan continuidad en el destino: misma oferta, mismas condiciones y
consistencia visual.

**Referencia:** anuncio y landing.

| Clasificación      | Evidencia                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **PASS**           | Promesa, mensaje, acción y estilo visual del anuncio se reconocen de inmediato en la landing.       |
| **WARNING**        | La oferta coincide, pero el mensaje o el estilo visual cambian notablemente.                        |
| **FAIL**           | La landing no contiene la promesa o la acción del anuncio, o presenta condiciones, precios o datos distintos. |
| **NO VERIFICABLE** | No se proporcionó el anuncio o la landing para comparar.                                            |

### 6. Presupuesto autorizado — CRÍTICO

**Qué se revisa:** que no exista contradicción con el presupuesto
aprobado: monto total, tipo (diario o total), distribución entre
campañas, conjuntos o plataformas, y moneda.

**Referencia:** plan de medios o presupuesto aprobado.

| Clasificación      | Evidencia                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **PASS**           | Monto, tipo, moneda y distribución coinciden con el presupuesto aprobado.                              |
| **WARNING**        | El total coincide, pero la distribución concentra o dispersa la inversión de forma poco eficiente para el objetivo. |
| **FAIL**           | El monto, tipo, moneda o distribución contradicen lo aprobado. Indicar monto esperado y configurado.   |
| **NO VERIFICABLE** | No se proporcionó el presupuesto aprobado o la evidencia de la configuración.                          |

### 7. Fechas — CRÍTICO

**Qué se revisa:** que el periodo de campaña sea correcto: fechas y
horarios de inicio y fin, zona horaria, programación, y su alineación con
la vigencia de la oferta y la disponibilidad de la landing.

**Referencia:** brief, plan de medios y vigencia de la oferta.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Fechas, horarios y zona horaria coinciden con lo solicitado y con la vigencia de la oferta.          |
| **WARNING**        | Las fechas coinciden, pero no se definió fecha de fin o hay poco margen antes del lanzamiento.       |
| **FAIL**           | Las fechas no coinciden con lo solicitado, la zona horaria es incorrecta o la campaña corre fuera de la vigencia de la oferta. |
| **NO VERIFICABLE** | No se indicaron las fechas requeridas o no se proporcionó evidencia de la configuración.             |

### 8. UTMs — CRÍTICO (condicional)

**Aplica cuando:** el destino es un sitio o landing propia cuya analítica
depende de parámetros UTM. Si no, es N/A.

**Qué se revisa:** que las URLs incluyan los parámetros requeridos, con
valores correctos que permitan trazabilidad y consistentes con la
convención acordada.

**Referencia:** convención de UTMs acordada y URLs finales.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | Todas las URLs tienen los parámetros requeridos y permiten identificar campaña, fuente y medio.         |
| **WARNING**        | Hay valores inconsistentes entre anuncios (mayúsculas, separadores, abreviaturas) que no impiden la trazabilidad. |
| **FAIL**           | Faltan parámetros, tienen valores incorrectos, rompen la URL o impiden la trazabilidad. Citar la URL.   |
| **NO VERIFICABLE** | No se proporcionaron las URLs finales. Si no hay convención acordada, sólo puede evaluarse trazabilidad y consistencia. |

### 9. QA previo a publicación — CRÍTICO

**Qué se revisa:** que se hayan comprobado los elementos críticos antes
del lanzamiento: vistas previas por ubicación, ligas probadas, formulario
enviado, lead recibido en el destino esperado, pruebas en móvil y
escritorio.

**Referencia:** evidencia de QA proporcionada por el equipo.

| Clasificación      | Evidencia                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **PASS**           | Hay evidencia de QA de los elementos críticos del flujo, de extremo a extremo.                       |
| **WARNING**        | Hay evidencia de QA, pero no cubre todos los dispositivos, ubicaciones o variantes del anuncio.      |
| **FAIL**           | La evidencia de QA muestra un error sin corregir (liga rota, formulario que no envía, lead que no llega). |
| **NO VERIFICABLE** | No se proporcionó evidencia de QA.                                                                   |

---

## IMPORTANTES

### 10. Segmentación — IMPORTANTE

**Qué se revisa:** que la segmentación configurada (geografía, edad,
intereses, listas, audiencias similares, exclusiones, idioma, plataformas
y ubicaciones) corresponda al objetivo, la audiencia, el producto, la
geografía, la plataforma y la hipótesis de campaña.

**No confundir una hipótesis razonable con un error.** Una segmentación
distinta a la que haría el revisor no es FAIL si responde a una hipótesis
documentada o razonable para el objetivo.

**Referencia:** brief, plan de medios, audiencia declarada e hipótesis de
campaña.

| Clasificación      | Evidencia                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **PASS**           | La segmentación corresponde a la audiencia, el producto y el plan, o a una hipótesis razonable.         |
| **WARNING**        | La segmentación es muy amplia o muy restringida para el objetivo, faltan exclusiones recomendables o la hipótesis no está documentada. |
| **FAIL**           | La segmentación contradice lo solicitado (zona, edad, lista, plataforma o exclusión incorrecta). Indicar valor esperado y configurado. |
| **NO VERIFICABLE** | No se proporcionó evidencia de la configuración de segmentación.                                        |

### 11. Copy — IMPORTANTE

**Qué se revisa:** que los textos del anuncio cumplan mensaje, audiencia
y plataforma: coinciden con el copy aprobado, respetan los límites de
caracteres y las políticas publicitarias de la plataforma.

La revisión completa del texto se realiza con las
[reglas de Contenido](contenido.md) cuando el copy no llega aprobado.

**Referencia:** copy aprobado, audiencia y especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **PASS**           | El texto coincide con el copy aprobado, es pertinente para la audiencia y se muestra completo. |
| **WARNING**        | El texto se trunca en alguna ubicación sin perder el mensaje principal.                        |
| **FAIL**           | El texto difiere del aprobado, contiene errores, incumple una política de la plataforma o se trunca perdiendo el mensaje o el CTA. |
| **NO VERIFICABLE** | No se proporcionó el copy aprobado ni vistas previas del anuncio.                              |

### 12. Creatividad — IMPORTANTE

**Qué se revisa:** que las piezas correspondan al objetivo y al medio:
son las aprobadas, cumplen las especificaciones y políticas de cada
plataforma y se visualizan correctamente en cada ubicación (recortes,
zonas seguras, duración, formato).

La revisión visual completa se realiza con las
[reglas de Diseño](diseno.md) cuando la pieza no llega aprobada.

**Referencia:** piezas aprobadas, objetivo y especificaciones de la plataforma.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Las piezas son las aprobadas, corresponden al medio y se visualizan correctamente.               |
| **WARNING**        | Alguna ubicación recorta o reduce elementos secundarios, o la pieza no está optimizada para alguna ubicación. |
| **FAIL**           | Se cargó una pieza no aprobada o anterior, incumple una especificación o política de la plataforma, o una ubicación oculta el mensaje, la marca o el CTA. |
| **NO VERIFICABLE** | No se proporcionaron las piezas aprobadas ni vistas previas por ubicación.                       |

### 13. CTA — IMPORTANTE

**Qué se revisa:** que el botón o llamada a la acción sea consistente con
la acción esperada y con lo que ocurre en el destino.

**Referencia:** objetivo, brief y destino del anuncio.

| Clasificación      | Evidencia                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **PASS**           | El CTA corresponde al objetivo y a la acción disponible en el destino.                          |
| **WARNING**        | El CTA es genérico cuando la plataforma ofrece uno más específico para la acción.               |
| **FAIL**           | El CTA promete una acción que el destino no ofrece (por ejemplo, "Registrarse" hacia una página sin formulario). |
| **NO VERIFICABLE** | No se proporcionó evidencia del CTA configurado.                                                |

### 14. Naming — IMPORTANTE

**Qué se revisa:** que los nombres de campañas, conjuntos de anuncios,
anuncios, audiencias y eventos permitan administración, identificación y
análisis, y sigan la convención acordada.

**Referencia:** convención de nomenclatura acordada.

| Clasificación      | Evidencia                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **PASS**           | Los nombres siguen la convención y permiten identificar cada elemento.                       |
| **WARNING**        | Hay nombres que se apartan de la convención o son inconsistentes entre sí.                  |
| **FAIL**           | Los nombres incumplen la convención acordada e impiden identificar o analizar la campaña.    |
| **NO VERIFICABLE** | No se proporcionaron los nombres. Si no hay convención acordada, sólo puede evaluarse si permiten identificación y análisis (PASS o WARNING). |

### 15. SEO — IMPORTANTE (condicional)

**Aplica exclusivamente a:** proyectos relacionados con SEO (landing o
sitio orientados a búsqueda orgánica, optimización de contenidos web).
En los demás casos es N/A.

**Qué se revisa, según contexto:** intención de búsqueda, keyword
principal, estructura, metadata, encabezados, indexación, enlazado y
velocidad.

**Referencia:** keywords y requisitos SEO del brief.

| Clasificación      | Evidencia                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **PASS**           | Los elementos SEO aplicables están presentes y bien aplicados.                                   |
| **WARNING**        | Hay elementos SEO ausentes o mejorables que no fueron exigidos.                                  |
| **FAIL**           | Faltan elementos SEO exigidos en el brief, o la página no es indexable cuando debe serlo.        |
| **NO VERIFICABLE** | El proyecto requiere SEO, pero no se indicaron keyword ni requisitos.                            |

---

## Performance

El performance inicial **no bloquea automáticamente** el Quality Gate.

Estas métricas pertenecen al **seguimiento de desempeño**, no
necesariamente al control de calidad previo. Registrarlas posteriormente
cuando correspondan:

- CTR
- CPC
- CPL
- MQL
- Conversión
- CPA
- ROAS

Si el performance posterior revela un problema de implementación que
existía antes de publicar (por ejemplo, una conversión que nunca se
registró), se documenta como aprendizaje del sistema, no como
reevaluación retroactiva del entregable.
