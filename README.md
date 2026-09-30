# Weekly Alignment & Unblock

Herramienta interna de la **Dirección de Posicionamiento** (Contenido, Diseño, Marketing Digital y SOC Store) para dirigir la sesión semanal de alineación.

No es un gestor de proyectos. Cada pantalla responde a cinco preguntas:

1. ¿Qué es importante?
2. ¿Qué está atorado?
3. ¿Qué necesitamos para avanzar?
4. ¿Quién lo va a resolver?
5. ¿Cuándo estará resuelto?

## Cómo correrlo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:5173
```

Otros comandos:

```bash
npm test           # pruebas de la lógica de dominio (Vitest)
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve el build
```

El build (`dist/`) es estático, con rutas relativas. Se puede publicar en cualquier servidor web interno, en SharePoint o abrirlo desde una carpeta compartida.

La primera vez que se abre, la app carga **datos de prueba** (17 proyectos de las cuatro áreas, bloqueos, dependencias, dos Weeklys anteriores). Se pueden restablecer o borrar en **Configuración → Datos**.

## Flujo de la sesión

```
Dashboard → INICIAR WEEKLY
  1. Compromisos de la sesión anterior  (¿Se cumplió? Sí / No / Reprogramar / Escalar)
  2. Proyectos en orden: P1 bloqueados → P1 activos → P2 bloqueados → P2 activos → P3
       AVANZA · BLOQUEADO · REQUIERE DECISIÓN · RESUELTO
       BLOQUEADO → qué bloquea, qué necesitamos, de quién depende, quién gestiona,
                   compromiso, fecha y hora → CREAR COMPROMISO
  3. CERRAR WEEKLY → advertencias de lo incompleto → resumen
       COPIAR RESUMEN PARA TEAMS · COPIAR COMPROMISOS
Después: cada responsable abre MIS COMPROMISOS.
La siguiente Weekly arranca revisando esos compromisos.
```

## Arquitectura

```
src/
  domain/            Lógica pura, sin React. Testeable.
    types.ts         Modelo de datos (Area, Person, Project, Blocker, Commitment, Session…)
    scoring.ts       SCORE = Impacto + Urgencia + Dependencia · P1/P2/P3 · ajuste manual
    selectors.ts     Derivados: VENCIDO, indicadores, orden del Modo Junta, dependencias
    operations.ts    Todas las mutaciones (crear bloqueo, reprogramar, cerrar sesión…)
    validation.ts    Revisión previa al cierre (bloqueos sin responsable, sin fecha…)
    summary.ts       Resumen ejecutivo y lista de compromisos para Teams
    dates.ts         Fechas locales en español
  data/
    storage.ts       Interfaz StorageAdapter + implementación localStorage
    store.tsx        Estado de la app: ejecuta operaciones, persiste, publica eventos
    seed.ts          Datos de prueba relativos a la semana actual
  integrations/      Punto de enganche para sistemas externos (ver abajo)
  components/        Formularios, modales, badges y campos reutilizables
  views/             Dashboard, Proyectos, Modo Junta, Centro de bloqueos, Compromisos,
                     Dependencias, Mis compromisos, Historial, Configuración
```

- **React 19 + TypeScript + Vite.** Sin librerías de UI, de estado ni de routing: router por hash propio, drag & drop HTML5 nativo, iconos SVG en línea. Única dependencia de runtime además de React: la tipografía DM Sans (alternativa libre a Circular), empaquetada para funcionar sin internet.
- **Un solo objeto `AppData` serializable.** Cada operación de dominio recibe una copia, la modifica y el store la guarda. Las operaciones son funciones puras sobre datos con reloj inyectado, por eso se prueban sin navegador.
- **"Vencido" nunca se guarda:** se calcula a partir de fecha + hora, y la vista se actualiza sola cada 30 segundos.
- **Bitácora de eventos de dominio** (`AppData.events`): cada cambio registra un evento (`commitment.rescheduled`, `blocker.resolved`, `session.closed`…). Es la base para métricas futuras y para integraciones.

### Preparado para integraciones

| Para conectar… | Dónde |
|---|---|
| Backend propio, SharePoint Lists, Dataverse | Implementar `StorageAdapter` (`load`, `save`, `clear`, `subscribe`) en `src/data/storage.ts` |
| Teams (webhook / Workflows), Power Automate | `registerIntegration()` en `src/integrations`; ejemplo listo en `teamsWebhook.ts` que publica el resumen al cerrar la Weekly |
| Microsoft Graph (Planner, To Do, calendario), Trello, CRM, notificaciones | Una `Integration` que escuche `commitment.*` / `blocker.*` |
| Identidad (quién soy) | Hoy "Mis compromisos" usa un selector de persona; con Graph se reemplaza por el usuario autenticado |

## Funcionalidades terminadas

- **Dashboard:** semana actual, fecha de sesión, indicadores clicables (proyectos, P1, bloqueados, compromisos pendientes, vencidos) que abren la vista filtrada, lo que necesita atención, próximos compromisos, resumen por área.
- **Proyectos:** tabla con área, responsable, impacto, urgencia, dependencia, score, prioridad, estado y fecha objetivo. Crear, editar, archivar/restaurar, cambiar estado, marcar bloqueado. Filtros por área, prioridad y estado, y búsqueda. Advertencia cuando un área supera 5 proyectos (configurable), sin bloquear.
- **Ponderación automática** con descripción de cada nivel, vista previa del score y ajuste manual de Dirección registrado (bitácora + marca "Manual").
- **Modo Junta:** interfaz de presentación sin menús administrativos, cola ordenada por prioridad y bloqueo, tarjeta grande por proyecto, navegación con ← →, P3 opcional, contador de tiempo.
- **Bloqueos:** formulario con las seis preguntas; regla de compromiso accionable (acción + responsable + fecha + hora) con la advertencia "Este bloqueo todavía no tiene un compromiso accionable." Soporta decisiones pendientes.
- **Centro de bloqueos:** Kanban Por destrabar / En gestión / Resuelto con drag & drop (y botones ‹ › para tablet), VENCIDO, "Reprogramado N veces", historial por bloqueo.
- **Compromisos:** estados Pendiente, En gestión, Cumplido, Reprogramado, Vencido y Escalado; acciones rápidas Cumplido, Reprogramar (nueva fecha, hora y motivo obligatorios, conserva la original), Escalar y Comentario; detalle con historial; reabrir y eliminar.
- **Dependencias:** QUIÉN NECESITA → QUÉ NECESITA → DE QUIÉN → CUÁNDO, filtros internas/externas/área, "¿a quién estamos esperando?" y relaciones área → área.
- **Cierre de Weekly:** valida bloqueos sin responsable, sin compromiso, compromisos sin fecha/hora/responsable, temas sin definición y compromisos anteriores sin revisar; permite completar o cerrar de todos modos.
- **Resumen automático** ejecutivo (no narrativo), **Copiar resumen para Teams** (texto + HTML con negritas) y **Copiar compromisos**.
- **Siguiente sesión:** revisión de compromisos anteriores en Cumplidos / Vencidos-Incumplidos / Reprogramados / Pendientes con Sí / No / Reprogramar / Escalar.
- **Mis compromisos:** checklist por persona, "lo que otras áreas necesitan de mi área" para responsables, cumplidos recientes.
- **Historial de Weeklys** con indicadores por sesión y su resumen para copiar de nuevo.
- **Configuración:** áreas (crear, editar, reordenar, responsable, color, eliminar o archivar si tiene historial), personas, nombre de la Dirección, máximo por área, exportar/importar respaldo JSON.
- **Responsive:** desktop completo; laptop angosta y tablet con barra lateral compacta y tablas en tarjetas en vertical; móvil con navegación inferior.

## Limitaciones actuales

- **Los datos viven en el navegador** (`localStorage`). No se comparten entre computadoras: la Weekly se conduce desde un equipo, y los gerentes consultan desde ese mismo equipo o con un respaldo exportado. Varias pestañas del mismo navegador sí se sincronizan.
- **Sin autenticación ni permisos:** cualquiera con acceso puede editar. "Mis compromisos" usa un selector de persona.
- **Sin notificaciones** automáticas de vencimiento.
- **Una Weekly en curso a la vez.** El historial guarda la fotografía del cierre y no se puede editar.
- La copia con formato (negritas) requiere HTTPS o `localhost`; en un servidor HTTP simple se copia como texto plano, que Teams también acepta.
- El drag & drop en tablets táctiles depende del navegador; por eso cada tarjeta tiene botones ‹ ›.

## Recomendaciones para una V2

1. **Datos compartidos:** un `StorageAdapter` contra una API ligera o SharePoint Lists/Dataverse para que todos vean lo mismo en tiempo real.
2. **Inicio de sesión con Microsoft (Entra ID)** para "Mis compromisos" automático y registro de quién cambió qué.
3. **Publicación en Teams** al cerrar la Weekly (el ejemplo `teamsWebhook.ts` ya existe) y recordatorios de compromisos 24 h antes y al vencer, vía Power Automate.
4. **Compromisos en el calendario u Outlook To Do** del responsable a través de Microsoft Graph.
5. **Métricas** con los datos que ya se guardan: % de compromisos cumplidos a tiempo, área con más dependencias, bloqueos recurrentes, tiempo promedio de resolución y número de reprogramaciones por persona o área.
6. **Plantilla de agenda por tiempo:** minutos sugeridos por bloque (revisión, P1, P2) con alerta suave del reloj.
