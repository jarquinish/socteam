# Quality Gate

Sistema de revisión de calidad de entregables del equipo SOC antes de su
publicación o entrega.

> **Versión 1 — operación manual.**
> Este sistema no está conectado con Trello, APIs ni servicios externos.

## Cómo funciona

Los integrantes del equipo proporcionan directamente todo lo necesario para
revisar cada entrega: archivos, briefs, documentos, imágenes, PDFs,
presentaciones, hojas de cálculo, links o contexto adicional.

La entrega se revisa contra las reglas del área correspondiente y el resultado
se documenta con la plantilla de resultado.

## Estructura

```
/quality-gate
  README.md                 Este archivo
  quality-gate.md           Definición y proceso del Quality Gate

  /rules                    Reglas de revisión por área
    contenido.md
    diseno.md
    marketing-digital.md
    soc-store.md

  /templates                Plantillas de uso
    resultado-quality-gate.md
    formulario-entrega.md

  /references               Fuentes de verdad: contra qué se evalúa
    README.md
    reference-index.md      Índice maestro de referencias
    source-priority.md      Jerarquía de fuentes y conflictos
    /brand  /campaigns  /content  /design
    /marketing-digital  /soc-store  /corporate
    /approved-examples

  /history                  Registro de revisiones realizadas

  /learning                 Aprendizaje continuo del sistema
    corrections.md
    manager-validation.md   Calibración de criterios con gerentes
```

## Estado

- [x] Estructura creada
- [x] Proceso del Quality Gate
- [x] Reglas por área
- [x] Plantillas
- [x] Criterios V1 (propuesta de Dirección)
- [ ] Calibración de criterios con gerentes
- [x] Arquitectura de referencias
- [x] Carga de las primeras referencias (marca y campaña "¿Qué es SOC?")
