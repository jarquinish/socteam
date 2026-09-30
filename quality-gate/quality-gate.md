# SOC QUALITY GATE

## Definición

**SOC QUALITY GATE** es el sistema de control de calidad de la
Dirección de Posicionamiento de SOC Asesores.

Su función es revisar entregables antes de considerarlos terminados.

## Alcance

Opera sobre cuatro gerencias:

| Gerencia          | Reglas                                                     |
| ----------------- | ---------------------------------------------------------- |
| Contenido         | [`rules/contenido.md`](rules/contenido.md)                 |
| Diseño            | [`rules/diseno.md`](rules/diseno.md)                       |
| Marketing Digital | [`rules/marketing-digital.md`](rules/marketing-digital.md) |
| SOC Store         | [`rules/soc-store.md`](rules/soc-store.md)                 |

## Insumos

Cada solicitud se acompaña del
[Formulario de Entrega](templates/formulario-entrega.md) y de los archivos,
briefs, documentos, imágenes, PDFs, presentaciones, hojas de cálculo, links
o contexto que el equipo proporcione directamente.

Si falta información, el Quality Gate continúa siempre que sea posible.
Nunca se inventan los datos faltantes.

---

## Flujo

1. **Recibir archivos y contexto.**
2. **Identificar la gerencia.**
3. **Identificar el tipo de entregable.**
4. **Leer el brief disponible.**
5. **Leer los requisitos obligatorios.**
6. **Cargar las reglas de la gerencia correspondiente.**
7. **Analizar el entregable.**
8. **Compararlo contra brief, objetivo, audiencia y requisitos.**
9. **Clasificar cada criterio.**
10. **Detectar problemas críticos.**
11. **Determinar el resultado general.**
12. **Identificar ajustes.**
13. **Analizar retrabajo cuando corresponda.**
14. **Generar el reporte utilizando la plantilla oficial:**
    [`templates/resultado-quality-gate.md`](templates/resultado-quality-gate.md)

---

## Clasificación por criterio

Cada criterio evaluado recibe una sola clasificación:

| Clasificación      | Significado                                        |
| ------------------ | -------------------------------------------------- |
| **PASS**           | Cumple correctamente.                              |
| **WARNING**        | Existe una oportunidad de mejora o riesgo menor.   |
| **FAIL**           | Existe evidencia concreta de incumplimiento.       |
| **NO VERIFICABLE** | No existe información suficiente para determinarlo.|

### Reglas de clasificación

- Un **FAIL** requiere evidencia concreta. Sin evidencia no hay FAIL.
- Nunca convertir automáticamente **NO VERIFICABLE** en **FAIL**.
- **NO VERIFICABLE** indica información faltante, no un error del
  responsable.

---

## Resultado general

| Resultado            | Significado                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| **APROBABLE**        | El entregable puede avanzar.                                                     |
| **REQUIERE AJUSTES** | Existen correcciones que deben realizarse antes de avanzar.                      |
| **INCOMPLETO**       | Existe un problema crítico que impide considerar terminado el entregable.        |

### Cómo se determina

El resultado general es un juicio sobre el conjunto del entregable.
No se utilizan únicamente promedios matemáticos.

- Un **FAIL** en un criterio crítico puede determinar **INCOMPLETO**.
- Varios **WARNING** pueden determinar **REQUIERE AJUSTES**.

Claude siempre debe explicar la causa del resultado.

---

## Principio

**El Quality Gate evalúa entregables, no personas.**

- No utilizar el resultado para hacer afirmaciones generales sobre el
  desempeño de un integrante.
- Evaluar evidencia concreta.
