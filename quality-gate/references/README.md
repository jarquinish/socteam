# Referencias — SOC Quality Gate

Biblioteca de documentos, lineamientos y ejemplos que SOC Quality Gate
consulta para evaluar entregables con evidencia real.

> **`/rules` define QUÉ evaluar.**
> **`/references` define CONTRA QUÉ evaluarlo.**

Las referencias no reemplazan las reglas. Las reglas indican qué criterio
revisar; las referencias aportan la fuente de verdad contra la que se
compara ese criterio.

---

## Estructura

```
/references
  README.md               Este archivo
  reference-index.md      Índice maestro de referencias
  source-priority.md      Jerarquía de fuentes y manejo de conflictos

  /brand                  Identidad y lineamientos maestros SOC
    /archive              Versiones anteriores
  /campaigns              Referencias por campaña
    /active               Campañas activas (una carpeta por campaña)
    /archive              Campañas finalizadas
  /content                Referencias de Contenido
    /examples
  /design                 Referencias de Diseño
    /examples
  /marketing-digital      Referencias de Marketing Digital
    /examples
  /soc-store              Referencias de SOC Store
    /examples
  /corporate              Información corporativa recurrente
  /approved-examples      Ejemplos aprobados como referencia de calidad
    /content
    /design
    /marketing-digital
    /soc-store
```

---

## Estados de una referencia

| Estado                        | Uso permitido                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| **VIGENTE**                   | Puede generar reglas obligatorias y sustentar un FAIL.                                         |
| **ARCHIVADO**                 | Sólo contexto histórico. Nunca bloquea una entrega actual.                                     |
| **PENDIENTE DE VALIDACIÓN**   | Puede orientar la evaluación, pero no genera por sí sola un FAIL.                              |
| **PENDIENTE DE CLASIFICACIÓN**| Archivo recibido cuya naturaleza, versión, vigencia o alcance aún no se determinan. No se usa para evaluar hasta clasificarse. |

Sólo las referencias **VIGENTES** generan reglas obligatorias.

---

## Cómo incorporar una nueva referencia

Cuando se añada un documento:

1. **No asumir** que sustituye a otro.
2. Determinar:
   - qué es;
   - qué área afecta;
   - versión;
   - vigencia;
   - alcance;
   - si reemplaza otro documento.
3. Si algo no puede determinarse, marcarlo como
   **PENDIENTE DE CLASIFICACIÓN**.
4. Guardarlo en la carpeta correspondiente.
5. Registrarlo en [`reference-index.md`](reference-index.md) con un ID.
6. Si reemplaza una versión anterior, mover la anterior a la carpeta
   `archive` correspondiente y cambiar su estado a **ARCHIVADO** en el
   índice. Nunca borrarla.

No inventar metadata: si un dato no se conoce, registrarlo como
"No especificado".

---

## Seguridad metodológica

Nunca:

- inventar reglas de SOC;
- inventar requisitos de Brandbook;
- asumir que un ejemplo es una norma;
- utilizar documentos archivados como vigentes;
- convertir preferencias en FAIL;
- ocultar contradicciones entre fuentes;
- penalizar a una persona por información contradictoria;
- aplicar una campaña anterior a una nueva sin evidencia.

---

## Documentos relacionados

- Jerarquía de fuentes y conflictos: [`source-priority.md`](source-priority.md)
- Protocolo de consulta: [`../quality-gate.md`](../quality-gate.md#protocolo-de-consulta-de-referencias)
