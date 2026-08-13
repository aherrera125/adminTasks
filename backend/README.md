# Backend - Admin Tasks

API REST para la gestión de tareas administrativas, construida con **Express 5** y **MySQL**. El backend también sirve estáticamente el frontend (`../frontend`), por lo que el único modo soportado de ejecutar la app completa es desde esta carpeta.

## Tecnologías

- **Express 5** - Framework web
- **mysql2/promise** - Driver MySQL con pool de conexiones
- **dotenv** - Variables de entorno
- **cors** - Control de CORS
- **nodemon** - Recarga automática en desarrollo (devDependency)

## Estructura

```
backend/
├── config/
│   └── db.js                    # Pool de conexiones MySQL + dotenv
├── src/
│   ├── app.js                   # Servidor Express + estáticos del frontend
│   ├── routes/
│   │   └── taskRoutes.js        # Definición de rutas de la API
│   ├── controllers/
│   │   └── taskController.js    # Lógica HTTP (validación, respuestas)
│   ├── services/
│   │   └── taskService.js       # Capa de servicio / reglas de negocio
│   └── models/
│       └── taskModel.js         # Consultas SQL a MySQL
├── .ejemplo.env                 # Plantilla de variables de entorno
└── package.json
```

Arquitectura en capas: `routes` -> `controllers` -> `services` -> `models`.

## Requisitos previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Base de datos `adminTasks` creada manualmente con una tabla `tasks`

No hay script de migración ni SQL de esquema en el repo. La forma de la tabla viene implícita en las consultas de `src/models/taskModel.js`:

```sql
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  due_date    DATE,
  status      ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Instalación y ejecución

Todos los comandos se ejecutan dentro de `backend/` (dotenv lee el `.env` desde el directorio de trabajo actual).

```bash
cd backend
npm install
```

1. Copia el `.env` de ejemplo:

```bash
cp .ejemplo.env .env
```

2. Ajusta las credenciales en `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=adminTasks
DB_PORT=3306
```

> Nota: si no existe `.env`, `config/db.js` conecta en silencio con credenciales por defecto (host `localhost`, user `root`, puerto `3306`) en lugar de fallar.

3. Ejecuta el servidor:

```bash
npm run dev     # con nodemon (recarga automática)
# o
npm start
```

El servidor queda disponible en `http://localhost:3000`. Sirve el frontend de forma estática y expone la API bajo `/api/tasks`.

### Comprobación rápida de la BD

```bash
curl http://localhost:3000/test-db
```

## API Endpoints

Base URL: `http://localhost:3000/api/tasks`

### GET `/api/tasks`

Recupera todas las tareas existentes.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Tarea de ejemplo",
      "description": "Descripción de la tarea",
      "due_date": "2026-05-20",
      "status": "pending",
      "created_at": "2026-05-13T10:30:00.000Z",
      "updated_at": "2026-05-13T10:30:00.000Z"
    }
  ]
}
```

### POST `/api/tasks`

Crea una nueva tarea (queda con estado `pending`).

**Cuerpo requerido (JSON):**
- `title` (string)
- `description` (string)
- `due_date` (string, formato `YYYY-MM-DD`)

**Ejemplo:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción detallada de la tarea",
  "due_date": "2026-05-30"
}
```

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "data": {
    "id": 2,
    "title": "Nueva tarea",
    "description": "Descripción detallada de la tarea",
    "due_date": "2026-05-30",
    "status": "pending",
    "created_at": "2026-05-13T10:35:00.000Z",
    "updated_at": "2026-05-13T10:35:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "ok": false,
  "error": "title, description and due_date are required"
}
```

### PUT `/api/tasks/:id/status`

Actualiza el estado de una tarea.

**Parámetros:**
- `id` (number): ID de la tarea
- `status` (string): uno de `pending`, `completed`, `rejected`

**Ejemplo:**
```json
{
  "status": "completed"
}
```

**Respuesta exitosa (200):** objeto `{ ok: true, data: { ...tarea actualizada } }`

**Errores:**
- `400` - `{ "ok": false, "error": "Invalid status" }` si el estado no es válido
- `404` - `{ "ok": false, "error": "Task not found" }` si la tarea no existe

### PUT `/api/tasks/:id`

Actualiza la descripción de una tarea.

**Parámetros:**
- `id` (number): ID de la tarea
- `description` (string): nueva descripción

**Ejemplo:**
```json
{
  "description": "Descripción actualizada"
}
```

**Respuesta exitosa (200):** objeto `{ ok: true, data: { ...tarea actualizada } }`

**Errores:**
- `400` - `{ "ok": false, "error": "description is required" }` si falta o no es string
- `404` - `{ "ok": false, "error": "Task not found" }` si la tarea no existe

### GET `/test-db`

Comprueba la conexión a la base de datos.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "rows": [ { "1": 1 } ]
}
```

## Notas de desarrollo

- El backend es ESM (`"type": "module"`); todos los imports internos incluyen la extensión `.js`.
- Los mensajes de error de la API y los logs del servidor están en español e inglés mezclados según el endpoint; no cambiar ese comportamiento.
- Los `console.log` de depuración en `taskController.js` y `taskModel.js` son intencionales y deben dejarse en su lugar.
- `npm run build` (tsc) y `npm test` son stubs vestigiales; no hay TypeScript real ni tests en este repo.
