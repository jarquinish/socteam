# Historial de revisiones — SOC Quality Gate

Registro de todas las revisiones realizadas con SOC Quality Gate.

Sirve para:

- comparar versiones en la **segunda revisión**;
- conservar la trazabilidad de cada dictamen (qué se evaluó, contra qué
  fuentes y con qué versión de criterios);
- aportar evidencia de uso real para calibrar los criterios (V1 → V1.1).

---

## Organización

```
/history
  README.md             Este archivo
  history-index.md      Índice de todas las revisiones
  /AAAA-MM              Una carpeta por mes
    QG-AAAA-NNNN_[gerencia]_[proyecto]_v[N].md
```

### ID de revisión

`QG-AAAA-NNNN`

- `AAAA`: año de la revisión.
- `NNNN`: consecutivo anual, empezando en `0001`. No se reutiliza.

Cada revisión tiene su propio ID, incluidas las segundas revisiones de un
mismo entregable.

### Nombre del archivo

`QG-AAAA-NNNN_[gerencia]_[proyecto]_v[N].md`

| Parte        | Valores                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| `[gerencia]` | `contenido`, `diseno`, `marketing-digital`, `soc-store`                  |
| `[proyecto]` | Nombre corto del proyecto o entregable, en minúsculas, con guiones y sin acentos |
| `v[N]`       | Número de revisión del mismo entregable: `v1`, `v2`, `v3`…              |

Ejemplo ilustrativo del formato (no es una revisión real):
`2026-11/QG-2026-0001_diseno_carrusel-hipotecario_v1.md`

---

## Contenido de cada archivo

Cada archivo contiene el **reporte completo** generado con la
[plantilla oficial](../templates/resultado-quality-gate.md), sin
modificaciones posteriores.

- **Los reportes no se editan después de emitidos.** Si un dictamen
  resulta incorrecto, se registra en
  [`learning/corrections.md`](../learning/corrections.md) y, si procede,
  se emite una nueva revisión con un nuevo ID.
- **Los entregables no se copian aquí.** El reporte registra el nombre o
  la liga de los archivos revisados; los archivos permanecen en su
  ubicación original.
- **El formulario de entrega** puede adjuntarse al final del reporte,
  bajo el título `ANEXO — FORMULARIO DE ENTREGA`.

---

## Cómo registrar una revisión

1. Asignar el siguiente ID disponible en
   [`history-index.md`](history-index.md).
2. Guardar el reporte en la carpeta del mes correspondiente, con el
   nombre definido arriba.
3. Agregar una fila al índice.
4. Si es una segunda revisión, indicar el ID de la revisión anterior en
   el reporte y en el índice.

---

## Uso del historial

**El historial registra entregables, no personas.**

- **Uso permitido:** análisis agregado por gerencia, tipo de entregable,
  criterio, causa de retrabajo o información faltante, para mejorar el
  sistema, las reglas, los briefs y las referencias.
- **Fuera de alcance:** usar el historial para evaluar el desempeño
  individual de un integrante.
  - Un resultado de Quality Gate no es una calificación de la persona.
  - Nunca se infiere desempeño individual a partir de una sola entrega.
  - Las causas de retrabajo muestran que muchos problemas no son
    atribuibles al responsable.

  Cualquier uso distinto requiere una decisión explícita de Dirección,
  fuera de este sistema.
