# Quality Gate — SOC Team

Punto de control obligatorio que todo entregable de la Dirección de Posicionamiento y Marketing Digital debe aprobar **antes** de publicarse, entregarse a la Red o reportarse como cumplido.

## Estructura

```
/quality-gate
  README.md                  ← Este archivo: qué es y cómo usarlo
  quality-gate.md            ← Proceso general, criterios comunes y escala de dictamen
  /rules                     ← Reglas específicas por gerencia
    contenido.md
    diseno.md
    marketing-digital.md
    soc-store.md
  /templates
    resultado-quality-gate.md  ← Plantilla para documentar cada revisión
  /history                   ← Resultados de revisiones ya realizadas
```

## Cómo se usa

1. Identifica la gerencia responsable del entregable.
2. Evalúa el entregable con los **criterios comunes** de `quality-gate.md`.
3. Evalúa con las reglas específicas de `rules/<gerencia>.md`.
4. Copia `templates/resultado-quality-gate.md` a `history/` con el nombre:
   `AAAA-MM-DD_<gerencia>_<entregable>.md`
5. Emite el dictamen: **Aprobado**, **Aprobado con ajustes** o **Rechazado**.

## Responsables

- **Dueño del proceso:** Dirección de Posicionamiento y Marketing Digital.
- **Revisores:** Gerente del área + un revisor de otra gerencia (revisión cruzada).
