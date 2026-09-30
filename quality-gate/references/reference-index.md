# Índice maestro de referencias

Índice único de todas las referencias disponibles para SOC Quality Gate.

Antes de evaluar un entregable, consultar este índice y cargar sólo las
referencias relevantes (ver
[Protocolo de consulta](../quality-gate.md#protocolo-de-consulta-de-referencias)).

---

## Convenciones

### IDs

| Prefijo            | Categoría                         | Carpeta                                   |
| ------------------ | --------------------------------- | ----------------------------------------- |
| `REF-BRAND-000`    | Identidad y lineamientos de marca | [`brand/`](brand/)                        |
| `REF-CAMP-000`     | Campañas                          | [`campaigns/`](campaigns/)                |
| `REF-CONT-000`     | Contenido                         | [`content/`](content/)                    |
| `REF-DES-000`      | Diseño                            | [`design/`](design/)                      |
| `REF-MKT-000`      | Marketing Digital                 | [`marketing-digital/`](marketing-digital/)|
| `REF-STORE-000`    | SOC Store                         | [`soc-store/`](soc-store/)                |
| `REF-CORP-000`     | Información corporativa           | [`corporate/`](corporate/)                |
| `REF-EXAMPLE-000`  | Ejemplos aprobados                | [`approved-examples/`](approved-examples/)|

Los IDs son consecutivos por prefijo y no se reutilizan, aunque la
referencia se archive.

### Columnas

| Columna        | Contenido                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------- |
| **ID**         | Identificador único.                                                                                |
| **Referencia** | Nombre del documento y ruta del archivo.                                                            |
| **Categoría**  | Brand, Campaña, Contenido, Diseño, Marketing Digital, SOC Store, Corporativo, Ejemplo.              |
| **Versión**    | Versión indicada en el documento. Si no se indica: "No especificado".                               |
| **Vigencia**   | Fecha o periodo de vigencia. Si no se indica: "No especificado".                                    |
| **Prioridad**  | Nivel de la [jerarquía de fuentes](source-priority.md) (1 a 6).                                     |
| **Estado**     | VIGENTE / ARCHIVADO / PENDIENTE DE VALIDACIÓN / PENDIENTE DE CLASIFICACIÓN.                         |
| **Aplicación** | A qué gerencias, entregables o campañas aplica.                                                     |

**No inventar metadata faltante.**

---

## Referencias registradas

| ID | Referencia | Categoría | Versión | Vigencia | Prioridad | Estado | Aplicación |
|---|---|---|---|---|---|---|---|
| REF-BRAND-001 | Manual de Identidad SOC 2026 — [`brand/Manual_de_Identidad_SOC_2026.pdf`](brand/Manual_de_Identidad_SOC_2026.pdf) | Brand | Octubre 2026 | Vigente, confirmado por Dirección el 30/09/2026. Fin de vigencia no especificado. | 2 | VIGENTE | Todas las gerencias, cuando el entregable usa la marca SOC. Única referencia de marca del sistema. |
| REF-CAMP-001 | Guiones de Edición 2026 — Campaña "¿Qué es SOC?" — [`campaigns/active/que-es-soc/assets/SOC_Guiones_Edicion_FINAL_2.pdf`](campaigns/active/que-es-soc/assets/SOC_Guiones_Edicion_FINAL_2.pdf) | Campaña | "Versión aprobada" 2026 (archivo FINAL_2) | Noviembre 2026 – noviembre 2028: dos años, día exacto no especificado. | 3 | VIGENTE | Edición de video de la campaña "¿Qué es SOC?": 15 guiones, 5 audiencias, 4 canales. Contenido, Diseño, Marketing Digital. |
| REF-CAMP-002 | Skill completo de campaña "¿Qué es SOC?" (`soc-mensaje-por-etapa`) — [`campaigns/active/que-es-soc/assets/skill-soc-mensaje-por-etapa.md`](campaigns/active/que-es-soc/assets/skill-soc-mensaje-por-etapa.md) | Campaña | No especificado. Idéntico al skill instalado `soc-mensaje-por-etapa` (verificado el 30/09/2026). | Noviembre 2026 – noviembre 2028: dos años, día exacto no especificado. | 3 | VIGENTE | Piezas de la campaña "¿Qué es SOC?" en cualquier red y formato: copy, sistema visual, audiencias, etapas y canales. Contenido, Diseño, Marketing Digital. |
| REF-CORP-001 | SOC TEAM — Sistema Operativo de la Dirección de Posicionamiento (skill `soc-team`) — [`corporate/skill-soc-team.md`](corporate/skill-soc-team.md) | Corporativo | No especificado. Copia del skill instalado `soc-team` al 30/09/2026. Estructura y datos con corte 3T 2026. | Vigente. Los datos CURRENT y PERFORMANCE tienen corte 3T 2026 y deben reemplazarse al iniciar 4T. | 2 | VIGENTE | Contexto corporativo y de Dirección: estructura de gerencias, sistema de conocimiento, Brand Gate de referencia rápida (§13), datos de autoridad. Para marca prevalece REF-BRAND-001; para campaña, REF-CAMP-001 y REF-CAMP-002. **No usar su modelo de desempeño ni sus datos de personas para evaluar entregables.** |

---

## Historial del índice

| Fecha | Cambio | ID afectado | Responsable |
|---|---|---|---|
| — | Índice creado sin referencias. | — | — |
| 30/09/2026 | Registro inicial de referencias, autorizado por Dirección. | REF-BRAND-001, REF-CAMP-001, REF-CAMP-002 | Dirección de Posicionamiento |
| 30/09/2026 | Versión del Manual (octubre 2026) y vigencia de la campaña (noviembre 2026, dos años) confirmadas por Dirección. | REF-BRAND-001, REF-CAMP-001, REF-CAMP-002 | Dirección de Posicionamiento |
| 30/09/2026 | Alta de SOC TEAM como referencia corporativa, solicitada por Dirección. | REF-CORP-001 | Dirección de Posicionamiento |
