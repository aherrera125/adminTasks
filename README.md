# Admin Tasks 📋

Una aplicación web para gestionar tareas administrativas con una interfaz oscura, moderna y responsiva. Las tareas se organizan por estado (pendientes, completadas, rechazadas) con vistas dedicadas para cada categoría.

## ✨ Características principales

### Frontend
- **Single page** en JavaScript vanilla + Bootstrap 5 (CDN), sin build step.
- **Barra de navegación** con tres vistas: 🏠 Inicio, ✅ Completadas y ❌ Rechazadas, más el botón **"Agregar Tarea"** que abre un modal de creación.
- **Vista Inicio** en tres columnas:
  - 📋 **Tareas Pendientes**: todas las pendientes.
  - ✅ **Completadas (Esta Semana)**: solo las completadas con `due_date` dentro de la semana en curso (la semana inicia domingo).
  - ❌ **Rechazadas (Esta Semana)**: solo las rechazadas de la semana en curso.
- **Vistas Completadas / Rechazadas** (todas las tareas):
  - Grid responsivo de tarjetas con gradientes.
  - **Búsqueda en tiempo real** por título.
  - **Paginación** de 12 tareas por página con botones Anterior/Siguiente y números de página.
- **Modal de detalle** de tarea: muestra toda la información, permite **editar la descripción** (solo pendientes) y **cambiar el estado** (completar / rechazar).
- **Modal de creación** de tarea con validación de campos.
- **Tema oscuro** basado en variables CSS (`:root`), animaciones y efectos hover.

### Backend
- **API REST** con Express 5 y arquitectura en capas: `routes` → `controllers` → `services` → `models`.
- **Persistencia MySQL** con pool de conexiones (`mysql2/promise`).
- **Validación de datos** en todas las operaciones (campos requeridos, estados válidos, tipos).
- **Servido estático del frontend**: el backend entrega `index.html`, `js/` y `css/` directamente.
- **Endpoint de sanity check** `/test-db` para verificar la conexión a la base de datos.
- ESM (`"type": "module"`), todos los imports incluyen la extensión `.js`.

## 📁 Estructura del proyecto

```
adminTasks/
├── backend/
│   ├── package.json
│   ├── .ejemplo.env                # Plantilla para crear .env
│   ├── config/
│   │   └── db.js                   # Pool de conexión a MySQL (dotenv)
│   └── src/
│       ├── app.js                  # Servidor Express + frontend estático
│       ├── controllers/
│       │   └── taskController.js   # Lógica HTTP y validaciones
│       ├── models/
│       │   └── taskModel.js        # Consultas SQL (mysql2/promise)
│       ├── routes/
│       │   └── taskRoutes.js       # Rutas de la API
│       └── services/
│           └── taskService.js      # Reglas de negocio
│
├── frontend/
│   ├── index.html                  # Estructura HTML (una sola página)
│   ├── package.json                # Sin scripts ni dependencias de servidor
│   ├── js/
│   │   └── app.js                  # Lógica JavaScript (fetch + render)
│   └── css/
│       └── style.css               # Estilos centralizados (tema oscuro)
│
└── README.md                       # Este archivo
```

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js
- MySQL (v5.7 o superior)
- npm (incluido con Node.js)

### 1. Crear la base de datos

La base de datos y la tabla se crean **manualmente** (no hay script de migración en el repo). Ejecuta en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS adminTasks;
USE adminTasks;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Configurar el backend

> ⚠️ El backend sirve el frontend estáticamente. La única forma soportada de ejecutar la app es desde la carpeta `backend/`. No ejecutes el frontend por separado en el puerto 8080: rompería todas las llamadas a `/api/tasks`.

```bash
cd backend
npm install
```

Copia la plantilla de entorno y ajusta las credenciales:

```bash
cp .ejemplo.env .env
```

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=adminTasks
DB_PORT=3306
```

### 3. Ejecutar

```bash
npm run dev    # nodemon, auto-reload
# o bien: npm start
```

El servidor estará disponible en **http://localhost:3000**.

### Verificar la base de datos

```bash
curl http://localhost:3000/test-db
```

Debe responder `{ "ok": true, "rows": [{ "1": 1 }] }`.

## 🔌 API Endpoints

Todos los endpoints responden en JSON con la forma `{ "ok": true, "data": ... }` o `{ "ok": false, "error": ... }`.

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

Crea una nueva tarea (siempre con estado `pending`).

**Parámetros requeridos (JSON):**
- `title` (string): Título de la tarea
- `description` (string): Descripción detallada
- `due_date` (string): Fecha de vencimiento (YYYY-MM-DD)

**Cuerpo de ejemplo:**
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

**Respuesta de error (400):**
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
- `status` (string): Nuevo estado (`pending`, `completed`, `rejected`)

**Cuerpo de ejemplo:**
```json
{
  "status": "completed"
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "title": "Tarea de ejemplo",
    "description": "Descripción de la tarea",
    "due_date": "2026-05-20",
    "status": "completed",
    "created_at": "2026-05-13T10:30:00.000Z",
    "updated_at": "2026-05-13T10:35:00.000Z"
  }
}
```

**Respuestas de error:**
- `400` — estado no válido: `{ "ok": false, "error": "Invalid status" }`
- `404` — tarea inexistente: `{ "ok": false, "error": "Task not found" }`

### PUT `/api/tasks/:id`

Actualiza la descripción de una tarea (único campo editable).

**Parámetros:**
- `id` (number): ID de la tarea
- `description` (string): Nueva descripción (obligatoria, debe ser string)

**Cuerpo de ejemplo:**
```json
{
  "description": "Descripción actualizada"
}
```

**Respuesta exitosa (200):** igual que `PUT /:id/status`, con la descripción actualizada.

**Respuestas de error:**
- `400` — `{ "ok": false, "error": "description is required" }`
- `404` — `{ "ok": false, "error": "Task not found" }`

## 🎨 Características del Frontend

### Vista Inicio
- Tres columnas de tarjetas: **Pendientes** (todas), **Completadas de esta semana** y **Rechazadas de esta semana**.
- Cada tarjeta muestra título, fecha de vencimiento (en rojo si ya venció) y botón **Detalle**.
- Las pendientes se ordenan por fecha de vencimiento ascendente.
- Semana calculada con `getCurrentWeekRange()` (inicia en domingo, termina el sábado).

### Vista Completadas / Rechazadas
- Grid responsivo con todas las tareas de ese estado (sin filtro de semana).
- Campo de búsqueda que filtra por título en tiempo real.
- Paginación: 12 tareas por página, botones ← Anterior / números / Siguiente →.
- Cada tarjeta muestra título, descripción (primeros 100 caracteres) y fecha, con botón **Ver Detalle**.

### Modal de Detalle
- Muestra título, descripción, fecha de vencimiento y estado.
- **Solo para tareas pendientes**: botones **Editar** (permite modificar y guardar la descripción), **✓ Completada** y **✗ Rechazada**.

### Modal de Creación
- Formulario con título, fecha de vencimiento y descripción (todos obligatorios).
- Al guardar, la tarea se crea como `pending` y las vistas se recargan automáticamente.

## 🎯 Flujo de uso

1. **Crear una tarea**: clic en "Agregar Tarea" → completar el modal → "Crear Tarea". Aparecerá en la columna de pendientes.
2. **Ver detalle**: clic en "Detalle" / "Ver Detalle" en cualquier tarea.
3. **Gestionar una pendiente** (desde el modal): editar descripción, marcarla como completada o rechazada.
4. **Buscar**: en las vistas Completadas/Rechazadas, escribir en el campo de búsqueda filtra por título al instante.
5. **Navegar entre páginas**: usar la paginación al pie de las vistas completas.
6. **Ver el trabajo de la semana**: la vista Inicio muestra solo las completadas/rechazadas de la semana actual.

## 💾 Dependencias

### Backend
- `express` — Framework web (v5)
- `dotenv` — Variables de entorno
- `mysql2` — Driver MySQL (pool de conexiones)
- `nodemon` — (dev) auto-reload en `npm run dev`

### Frontend
- `bootstrap@5.3.0` — CSS y JS desde CDN
- JavaScript vanilla — Sin dependencias adicionales

## 📝 Notas de desarrollo

### Ejecución
- El frontend lo sirve el backend (`backend/src/app.js:16`). Corre siempre desde `backend/`.
- `config/db.js` carga `backend/.env` explícitamente y exige `DB_PASSWORD`. Si falta la configuración, el servidor muestra un error claro al iniciar.

### Estilo y código
- UI, comentarios y logs en **español**.
- Hay muchos `console.log` de depuración a propósito, tanto en el backend como en `frontend/js/app.js` — no se deben eliminar salvo que se pida.
- CSS con variables en `:root`, sistema de vistas mediante `.view-container` / `.view-container.active` y `switchView()`.
- En el frontend: `allTasks` es el caché global de tareas; `filteredCompletedTasks` y `filteredRejectedTasks` guardan las listas filtradas; `renderAllTasksView()` se encarga de la paginación.

## 🐛 Solución de problemas

### El backend no inicia
- Verifica que MySQL esté ejecutándose.
- Comprueba los valores en `backend/.env` (o copia `.ejemplo.env`).
- Asegúrate de que el puerto 3000 esté disponible.

### Las tareas no se guardan / no aparecen
- Verifica la conexión a la base de datos con `curl http://localhost:3000/test-db`.
- Confirma que la base `adminTasks` y la tabla `tasks` existan con la estructura indicada.
- Revisa la consola del navegador y los logs del backend.

### El filtro o la paginación no funcionan
- Asegúrate de estar en la vista completa (Completadas/Rechazadas), no en Inicio.
- Verifica que haya tareas para filtrar.

### El frontend no carga desde el puerto 8080
- El frontend debe abrirse en `http://localhost:3000` (servido por el backend). No uses el `npm start` de `frontend/`.

---

**Última actualización**: Agosto 2026
