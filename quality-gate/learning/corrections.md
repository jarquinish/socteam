# Correcciones del sistema

Registro de los casos en que **SOC Quality Gate se equivocó o fue
insuficiente**, y de los ajustes que se derivan de ellos.

Aquí se corrige **el sistema**, no a las personas. Una corrección
documenta que una regla, una referencia o una aplicación del proceso
produjo un dictamen incorrecto o incompleto.

Junto con [`manager-validation.md`](manager-validation.md), este archivo
es la evidencia de uso real con la que los criterios evolucionan de
**V1** a **V1.1**.

---

## Cuándo registrar una corrección

- Un **FAIL** que no debió serlo (falso FAIL).
- Un **PASS** que no debió serlo (problema no detectado).
- Una **clasificación** incorrecta (por ejemplo, WARNING en lugar de FAIL).
- Una **importancia** mal asignada (CRÍTICO, IMPORTANTE, DESEABLE).
- Un criterio marcado **N/A** que sí aplicaba, o al revés.
- Un **NO VERIFICABLE** que sí podía verificarse con la información
  disponible.
- Una **referencia** faltante, desactualizada o mal aplicada.
- Una **regla ambigua** que admitió interpretaciones distintas.
- Un **conflicto de fuentes** no detectado.
- Un **resultado general** incorrecto.
- Una causa de **retrabajo** mal atribuida.

Puede registrarla Dirección, un gerente o quien opere el Quality Gate.

---

## Reglas

1. **Una corrección no modifica automáticamente las reglas.** Primero se
   registra como PROPUESTA; sólo Dirección la aprueba.
2. **Los reportes en `/history` no se editan.** La corrección referencia
   el ID de la revisión afectada. Si el entregable necesita un nuevo
   dictamen, se emite una nueva revisión con un nuevo ID.
3. **Toda corrección requiere evidencia**: qué dijo el Quality Gate, qué
   debió decir y por qué, con la fuente que lo sustenta.
4. **No atribuir la corrección a personas.** Registrar el origen como un
   problema de regla, referencia, información o aplicación del proceso.
5. **Un solo caso no justifica cambiar una regla general**, salvo que la
   regla sea claramente incorrecta. Los patrones repetidos se consolidan
   en la sección [Patrones](#patrones).
6. Cuando una corrección aprobada modifica un archivo del sistema,
   registrarlo en [Control de versiones de criterios](#control-de-versiones-de-criterios).

---

## Tipos de corrección

| Tipo                        | Descripción                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| **FALSO FAIL**              | Se marcó FAIL sin evidencia suficiente o por una preferencia.         |
| **FALSO PASS**              | Se marcó PASS y existía un incumplimiento con evidencia.              |
| **CLASIFICACIÓN INCORRECTA**| La clasificación del criterio no correspondía a la evidencia.         |
| **IMPORTANCIA INCORRECTA**  | La importancia por defecto no correspondía al entregable o al contexto. |
| **N/A INCORRECTO**          | Se marcó N/A un criterio que aplicaba, o se evaluó uno que no aplicaba. |
| **NO VERIFICABLE INCORRECTO** | Se marcó NO VERIFICABLE con información suficiente para verificar.  |
| **REFERENCIA FALTANTE**     | No existía la referencia necesaria en `/references`.                  |
| **REFERENCIA MAL APLICADA** | Se usó una referencia archivada, no aplicable o mal interpretada.     |
| **REGLA AMBIGUA**           | La regla admitió interpretaciones distintas.                          |
| **CONFLICTO NO DETECTADO**  | Dos fuentes se contradecían y no se marcó CONFLICTO DE FUENTES.       |
| **RESULTADO INCORRECTO**    | El resultado general no correspondía a los hallazgos.                 |
| **RETRABAJO MAL ATRIBUIDO** | La causa o el tipo de retrabajo no correspondían a la evidencia.      |
| **OTRO**                    | Describir.                                                            |

## Acciones posibles

| Acción                       | Descripción                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| **NINGUNA**                  | Error puntual de aplicación; la regla es correcta.              |
| **AJUSTAR REGLA**            | Modificar un archivo de `/rules` o `quality-gate.md`.           |
| **AJUSTAR PLANTILLA**        | Modificar un archivo de `/templates`.                           |
| **AGREGAR REFERENCIA**       | Incorporar o actualizar un documento en `/references`.          |
| **VALIDAR CON GERENTE**      | Llevar el caso a `manager-validation.md`.                       |
| **DECISIÓN DE DIRECCIÓN**    | Requiere una definición que el sistema no puede tomar.          |

## Estados

| Estado        | Significado                                            |
| ------------- | ------------------------------------------------------ |
| **PROPUESTA** | Registrada, pendiente de revisión.                     |
| **APROBADA**  | Dirección aprobó la acción.                            |
| **APLICADA**  | El cambio ya se hizo en el archivo correspondiente.    |
| **DESCARTADA**| Se revisó y no procede. Indicar por qué.               |

---

## Plantilla de registro

Copiar al final de la sección [Registro](#registro):

```
### COR-AAAA-NNN — [título breve]

FECHA:
REGISTRADA POR:              (rol o área)
REVISIÓN AFECTADA:           QG-AAAA-NNNN
GERENCIA:
CRITERIO:
TIPO DE CORRECCIÓN:

QUÉ DIJO QUALITY GATE:
QUÉ DEBIÓ DECIR:
EVIDENCIA:                   (fuente, ID de referencia, ubicación)
ORIGEN DEL ERROR:            (regla, referencia, información, aplicación del proceso)

ACCIÓN PROPUESTA:
ARCHIVO A MODIFICAR:
ESTADO:                      PROPUESTA / APROBADA / APLICADA / DESCARTADA
APROBADA POR:
FECHA DE APLICACIÓN:
VERSIÓN RESULTANTE:
```

`COR-AAAA-NNN`: año y consecutivo anual, empezando en `001`.

---

## Registro

*Sin correcciones registradas todavía.*

---

## Patrones

Correcciones que se repiten y que sustentan un cambio de regla o de
referencia.

| Patrón | Correcciones relacionadas | Gerencia | Acción propuesta | Estado |
|---|---|---|---|---|
| — | *Sin patrones identificados todavía.* | — | — | — |

---

## Control de versiones de criterios

| Versión | Fecha | Cambio | Archivos | Origen | Aprobado por |
|---|---|---|---|---|---|
| V1 | 30/09/2026 | Criterios V1 de las cuatro gerencias, propuesta de Dirección. Pendiente de calibración con gerentes. | `quality-gate.md`, `/rules`, `/templates` | Propuesta de Dirección | Dirección de Posicionamiento |
