# adminTasks

## Backend

### Estructura principal

- `backend/package.json` - scripts y dependencias.
- `backend/src/app.js` - servidor Express y rutas.
- `backend/src/routes/taskRoutes.js` - rutas de tareas.
- `backend/src/controllers/taskController.js` - controladores de lógica HTTP.
- `backend/src/services/taskService.js` - capa de servicio entre controladores y modelos.
- `backend/src/models/taskModel.js` - consultas a la base de datos MySQL.
- `backend/config/db.js` - configuración de conexión a la base de datos.

### Dependencias del backend

- `express`
- `cors`
- `dotenv`
- `mysql2`

### Cómo ejecutar

1. Entra en la carpeta del backend:

```bash
cd backend
```

2. Instala dependencias si aún no lo has hecho:

```bash
npm install
```

3. Ejecuta el servidor:

```bash
npm start
```

El servidor escucha en el puerto `3000`.

### Configuración de base de datos

La conexión usa variables de entorno en `.env`. Los valores por defecto son:

- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=TU_PASSWORD`
- `DB_NAME=adminTasks`
- `DB_PORT=3306`

### Endpoints disponibles

- `GET /api/tasks`
  - Retorna todas las tareas.
- `POST /api/tasks`
  - Crea una nueva tarea.
  - Campos requeridos en el body JSON:
    - `title`
    - `description`
    - `due_date`

### Ejemplo de `curl` para crear una tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","description":"Descripción de la tarea","due_date":"2026-05-01"}'
```

### Ejemplo de respuesta esperada

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "due_date": "2026-05-01",
    "status": "pending",
    "created_at": "2026-04-18T...",
    "updated_at": "2026-04-18T..."
  }
}
```

### Rutas adicionales de prueba

- `GET /test-db`
  - Verifica la conexión con la base de datos.

### Estado actual

El backend está configurado con un endpoint de lectura y uno de creación de tareas. La lógica fluye desde la ruta hacia el controlador, el servicio y el modelo, usando MySQL como fuente de datos.
