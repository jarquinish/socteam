# Referencias — Campañas

Aquí se guardan las **referencias específicas de cada campaña**.

Nivel en la [jerarquía de fuentes](../source-priority.md): **3 — Campaña
vigente**.

---

## Organización

```
/campaigns
  /active
    /[nombre-campaña]
      campaign.md       Ficha de la campaña
      /assets           Key visual, claims, sistema gráfico, piezas maestras
      /examples         Piezas aprobadas de la campaña
  /archive
    /[nombre-campaña]   Campañas finalizadas (misma estructura)
```

- El nombre de la carpeta usa minúsculas y guiones, sin acentos
  (por ejemplo, `que-es-soc`).
- Cada campaña se registra en el [índice maestro](../reference-index.md)
  con un ID `REF-CAMP-000`.

---

## Reglas

- Una campaña sólo genera requisitos obligatorios para **piezas de esa
  campaña** y mientras su estado sea **ACTIVA**.
- Al finalizar una campaña, mover su carpeta a [`archive/`](archive/) y
  cambiar su estado a **FINALIZADA** en `campaign.md` y a **ARCHIVADO** en
  el índice.
- **Las reglas de una campaña finalizada no se aplican automáticamente a
  campañas nuevas.** Sólo pueden usarse si la nueva campaña lo indica
  explícitamente.
- No inventar datos de campaña: si un campo no está definido en una
  fuente oficial, escribir "No especificado".

---

## Plantilla de `campaign.md`

Copiar esta plantilla en `/active/[nombre-campaña]/campaign.md`:

```markdown
# [NOMBRE DE CAMPAÑA]

ID: REF-CAMP-000

NOMBRE DE CAMPAÑA:

ESTADO:
ACTIVA / FINALIZADA

VIGENCIA:

OBJETIVO:

AUDIENCIA:

CONCEPTO:

MENSAJE PRINCIPAL:

CLAIM:

CTA:

PALETA / SISTEMA VISUAL:

ELEMENTOS OBLIGATORIOS:

ELEMENTOS PROHIBIDOS:

FORMATOS:

FUENTES OFICIALES:
(documentos de los que se tomó cada dato, con su ID)

OBSERVACIONES:
```

---

## Campañas registradas

| Campaña       | Carpeta                                      | Estado                 | Fuentes                     |
| ------------- | -------------------------------------------- | ---------------------- | --------------------------- |
| ¿Qué es SOC?  | [`active/que-es-soc/`](active/que-es-soc/campaign.md) | ACTIVA — inicia nov. 2026 (dos años) | REF-CAMP-001, REF-CAMP-002 |
