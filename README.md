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

### Modo compartido (recomendado)

Todos ven la misma información en tiempo real.

```bash
npm install
npm run build
npm start                 # http://localhost:8787
```

Para desarrollo, en dos terminales:

```bash
npm run dev:server        # API en :8787 (se recarga al editar)
npm run dev               # app en :5173, con /api apuntando al servidor
```

### Modo local (sin servidor)

`npm run dev` sin el servidor, o publicar solo `dist/` en cualquier hosting estático. Los datos viven en el navegador.

La app detecta sola en qué modo está. El indicador de la barra lateral lo muestra: "Compartido · al día" o "Guardado en este navegador".

### Pruebas

```bash
npm test                  # 23 pruebas: dominio, sincronización, métricas, calendario, Teams
npm run typecheck
```

## Flujo de la sesión

```
Dashboard → INICIAR WEEKLY
  1. Revisión de compromisos anteriores  (¿Se cumplió? Sí / No / Reprogramar / Escalar)
  2. Proyectos: P1 bloqueados → P1 activos → P2 bloqueados → P2 activos → P3
       AVANZA · BLOQUEADO · REQUIERE DECISIÓN · RESUELTO
       con tiempo sugerido por bloque (agenda)
  3. CERRAR WEEKLY → advertencias → resumen
       Publicar en Teams · Copiar resumen · Copiar compromisos
Después: cada responsable abre MIS COMPROMISOS (y los tiene en su calendario).
Teams avisa 24 h antes de cada compromiso y cuando vence.
La siguiente Weekly arranca revisando esos compromisos.
```

## Novedades de la V2

| | Qué hace |
|---|---|
| **Datos compartidos** | Servidor con control de versión. Si dos personas editan a la vez, la operación se reaplica sobre la versión más reciente y no se pierde ningún cambio. Actualización en vivo entre equipos. Si se pierde la conexión, los cambios quedan pendientes y se reintentan. |
| **Identidad** | "Estás como…" en la barra lateral. Cada cambio registra quién lo hizo y los historiales lo muestran. Con Microsoft Entra ID (Easy Auth), la persona se reconoce por su correo. |
| **Teams** | El resumen se publica en el canal al cerrar la Weekly (automático o con botón). Recordatorios 24 h antes de cada compromiso y al vencer. Botón de prueba en Configuración. |
| **Calendario** | "Calendario" en cada compromiso (.ics). En Mis compromisos: descargar todos o **suscribir en Outlook**, un calendario que se actualiza solo con los compromisos abiertos. |
| **Métricas** | % de compromisos cumplidos a tiempo, cumplidos tarde, vencidos, reprogramaciones por compromiso, tiempo promedio de resolución de bloqueos, cumplimiento por área y por responsable, a quién esperamos más, área con más dependencias, bloqueos recurrentes y tendencia por Weekly. Periodo: 4 semanas, 12 semanas o todo. |
| **Agenda** | Minutos sugeridos por bloque (revisión, P1, P2, P3), configurables. En el Modo Junta se ve el tiempo del bloque actual y cambia de color al excederse. |

## Servidor

### Variables de entorno

Ver `.env.example`.

| Variable | Para qué |
|---|---|
| `PORT` | Puerto (8787). |
| `TZ` | Zona horaria de las fechas y horas compromiso, p. ej. `America/Mexico_City`. **Importante** para recordatorios y calendario. |
| `DATA_DIR` | Carpeta persistente con `db.json`, `state.json` y `backups/` (un respaldo por día). |
| `SEED` | `demo` carga los datos de prueba la primera vez; `empty` arranca vacío. |
| `PUBLIC_URL` | URL pública de la app, para los enlaces en Teams y en el calendario. |
| `AUTH_MODE` | `none` o `easyauth`. |
| `TEAMS_WEBHOOK_URL` | Webhook del canal de Teams. |
| `TEAMS_AUTO_PUBLISH` | Publicar el resumen al cerrar (`true` por defecto). |
| `REMINDERS` | Recordatorios de compromisos (`true` por defecto; requieren webhook). |
| `CALENDAR_TOKEN` | Si se define, los calendarios suscritos requieren `?token=`. Recomendado. |

### Despliegue en Azure App Service con inicio de sesión Microsoft

1. Crear un App Service (Linux, Node 22) o usar el `Dockerfile` incluido. Montar almacenamiento persistente en `DATA_DIR`.
2. **Authentication → Add identity provider → Microsoft** (Entra ID de SOC). En "Restrict access" elegir **Allow unauthenticated access**: la app exige la sesión en `/api` y deja pasar solo el calendario suscrito, que se protege con `CALENDAR_TOKEN`, porque Outlook no puede iniciar sesión.
3. Configurar `AUTH_MODE=easyauth`, `TZ`, `PUBLIC_URL` y `CALENDAR_TOKEN`.
4. En **Configuración → Personas**, capturar el correo corporativo de cada persona. Así la app reconoce quién entra.

Sin Azure, el servidor corre en cualquier máquina con Node (`npm start`) o con Docker:

```bash
docker build -t weekly-alignment .
docker run -p 8787:8787 -v weekly-data:/data -e TZ=America/Mexico_City weekly-alignment
```

### Conectar Teams

1. En el canal de Teams: **… → Workflows → "Publicar en un canal cuando se reciba una solicitud de webhook"**. También sirve un flujo de Power Automate con el desencadenador "Cuando se recibe una solicitud de webhook de Teams".
2. Copiar la URL que genera y ponerla en `TEAMS_WEBHOOK_URL`.
3. En **Configuración → Integraciones → Enviar prueba** para verificar.

Los mensajes son Adaptive Cards: resumen de la Weekly y recordatorios agrupados en una sola tarjeta. Cada aviso se envía una vez por fecha compromiso; si se reprograma, vuelve a avisar. Al instalar no se avisan vencimientos antiguos, para no saturar el canal.

### API

| Ruta | |
|---|---|
| `GET /api/health` | Estado y funciones activas. |
| `GET /api/me` | Identidad del usuario (Easy Auth) y su persona. |
| `GET /api/data` · `PUT /api/data` | Documento completo con versión; `409` si hubo un cambio más reciente. |
| `GET /api/stream` | Server-Sent Events con cada versión nueva. |
| `GET /api/calendar/:personaId.ics` | Calendario suscribible de una persona. |
| `GET /api/calendar-link/:personaId` | Enlace de suscripción (incluye el token). |
| `POST /api/teams/summary` · `POST /api/teams/test` | Publicar resumen / mensaje de prueba. |

## Arquitectura

```
src/
  domain/            Lógica pura, sin React. Testeable y compartida con el servidor.
    types.ts         Modelo de datos
    scoring.ts       SCORE = Impacto + Urgencia + Dependencia · P1/P2/P3 · ajuste manual
    selectors.ts     Derivados: VENCIDO, indicadores, orden del Modo Junta, dependencias
    operations.ts    Todas las mutaciones, con autor (actorId) en cada evento e historial
    validation.ts    Revisión previa al cierre
    summary.ts       Resumen ejecutivo y lista de compromisos
    metrics.ts       Métricas de ejecución
    ics.ts           Calendario iCalendar
  data/
    sync.ts          Motor de sincronización: UI optimista, reaplicar en conflicto, reintentos
    backends.ts      LocalBackend (navegador) y ServerBackend (API + SSE), detección automática
    store.tsx        Estado de React sobre el motor + identidad
    seed.ts          Datos de prueba relativos a la semana actual
  integrations/      Enganche para integraciones en el cliente
  components/ views/ Interfaz
server/
  index.ts           HTTP: API, SSE, identidad, calendario, Teams, archivos estáticos
  db.ts              Documento JSON versionado, escritura atómica, respaldos diarios
  teams.ts           Adaptive Cards, recordatorios, detección de cierre de Weekly
  config.ts          Variables de entorno
```

- **React 19 + TypeScript + Vite** en el cliente. El **servidor usa solo Node estándar**: el build (`dist-server/index.js`) no necesita `node_modules` en producción.
- **Cambios como operaciones deterministas.** Cada operación recibe reloj, ids y autor fijos. Por eso se puede reaplicar tras un conflicto con el mismo resultado, y las pruebas no necesitan navegador.
- **Un documento por equipo**, adecuado para decenas de personas. Para crecer, se reemplaza `server/db.ts` (SQL, Dataverse, SharePoint Lists) sin tocar el cliente.

## Limitaciones actuales

- La identidad corporativa depende de Easy Auth de Azure App Service. En otro hosting, la persona se elige manualmente.
- El servidor confía en el autor que envía el cliente. Con Easy Auth podría validarlo contra la sesión; eso queda para la siguiente versión.
- Los cambios pendientes sin conexión viven en memoria: si se cierra la pestaña antes de reconectar, se pierden (la app advierte al intentar cerrar).
- Recordatorios y resumen van a un solo canal de Teams; aún no hay mensajes directos por persona.
- En modo local no hay Teams, recordatorios ni calendario suscrito (sí la descarga de .ics).
- Una sola Weekly en curso a la vez; el historial es la fotografía del cierre.

## Siguiente paso sugerido (V3)

1. Mensajes directos por persona en Teams (Graph `chatMessage` o un bot) en lugar de un solo canal.
2. Validar en el servidor que el autor coincide con la sesión de Entra ID y agregar roles (Dirección edita todo; gerentes, lo suyo).
3. Crear las tareas en Planner o To Do del responsable con Microsoft Graph.
4. Guardar los cambios pendientes sin conexión en IndexedDB.
5. Varias Direcciones o equipos en la misma instalación.
