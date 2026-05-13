# Admin Tasks 📋

Una aplicación web moderna para gestionar tareas administrativas con una interfaz intuitiva y responsiva. Las tareas se organizan por estado (pendientes, completadas, rechazadas) con vistas dedicadas para cada categoría.

## ✨ Características principales

### Frontend
- **Interfaz moderna y responsiva** con Bootstrap 5
- **Tres vistas principales:**
  - 🏠 **Inicio**: Formulario de creación + tareas de la semana en curso (3 columnas)
  - ✅ **Completadas**: Todas las tareas completadas con filtro en tiempo real
  - ❌ **Rechazadas**: Todas las tareas rechazadas con filtro en tiempo real
- **Filtro de búsqueda en tiempo real** en vistas completas
- **Diseño visual atractivo:**
  - Formulario destacado en la parte superior
  - Tarjetas de tareas con gradientes de colores
  - Fondo oscuro en vistas de historial
  - Animaciones y efectos hover fluidos

### Backend
- **API REST completa** para gestión de tareas
- **Arquitectura en capas:**
  - Controladores
  - Servicios
  - Modelos
- **Base de datos MySQL** con persistencia de datos
- **Validación de datos** en todas las operaciones

## 📁 Estructura del proyecto

```
adminTasks/
├── backend/
│   ├── package.json
│   ├── config/
│   │   └── db.js                    # Configuración de BD
│   └── src/
│       ├── app.js                   # Servidor Express
│       ├── controllers/
│       │   └── taskController.js    # Lógica HTTP
│       ├── models/
│       │   └── taskModel.js         # Consultas BD
│       ├── routes/
│       │   └── taskRoutes.js        # Rutas de API
│       └── services/
│           └── taskService.js       # Capa de servicio
│
├── frontend/
│   ├── index.html                   # Estructura HTML
│   ├── package.json
│   ├── js/
│   │   └── app.js                   # Lógica JavaScript
│   ├── css/
│   │   └── style.css                # Estilos centralizados
│   └── html/                        # Vistas adicionales (opcional)
│
└── README.md                        # Este archivo
```

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm (incluido con Node.js)

### Backend

1. Entra en la carpeta del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con la configuración:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=adminTasks
DB_PORT=3306
```

4. Ejecuta el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Entra en la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo (si tienes uno configurado) o abre `index.html` directamente en el navegador.

## 🔌 API Endpoints

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

Crea una nueva tarea.

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
- `status` (string): Nuevo estado (pending, completed, rejected)

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

### PUT `/api/tasks/:id`

Actualiza los datos de una tarea (descripción).

**Parámetros:**
- `id` (number): ID de la tarea
- `description` (string): Nueva descripción

**Cuerpo de ejemplo:**
```json
{
  "description": "Descripción actualizada"
}
```

## 🎨 Características del Frontend

### Vista Home (Inicio)
- **Formulario de creación** en la parte superior
- **Tres columnas de tareas:**
  - 📋 Tareas Pendientes (amarillo pastel)
  - ✅ Tareas Completadas de esta semana (verde)
  - ❌ Tareas Rechazadas de esta semana (rojo)
- Cada tarea muestra título, fecha de vencimiento y botón de detalle

### Vista Completadas
- **Grid responsivo** con todas las tareas completadas
- **Campo de filtro** para buscar por título en tiempo real
- **Tarjetas de tareas** con gradiente verde
- **Información completa**: título, descripción (primeras 100 caracteres), fecha

### Vista Rechazadas
- **Interfaz similar a Completadas**
- **Tarjetas de tareas** con gradiente rojo
- **Fondo oscuro** para mejor visibilidad
- **Búsqueda en tiempo real**

### Modal de Detalle
- Muestra información completa de la tarea
- Permite editar descripción (solo tareas pendientes)
- Botones para cambiar estado (completar/rechazar)

## 🎯 Funcionalidades detalladas

### Creación de tareas
1. Completa título, descripción y fecha
2. Haz clic en "Crear Tarea"
3. La tarea aparecerá automáticamente en la columna de pendientes

### Gestión de estado
1. Haz clic en "Detalle" en cualquier tarea
2. En el modal, puedes:
   - Ver información completa
   - Editar descripción (si está pendiente)
   - Marcar como completada
   - Marcar como rechazada

### Búsqueda de tareas
1. Ve a la sección "Completadas" o "Rechazadas"
2. Escribe en el campo de búsqueda
3. Las tareas se filtran en tiempo real por título

### Filtro de semana
- Las vistas de completadas y rechazadas en el inicio muestran solo tareas de esta semana
- Las vistas completas (desde el menú) muestran todas las tareas

## 💾 Dependencias

### Backend
- `express` - Framework web
- `cors` - Control de CORS
- `dotenv` - Variables de entorno
- `mysql2` - Driver MySQL

### Frontend
- `bootstrap@5.3.0` - Framework CSS
- JavaScript vanilla - Sin dependencias adicionales

## 📝 Notas de desarrollo

### Organización de CSS
- Todos los estilos se encuentran centralizados en `frontend/css/style.css`
- Se usan clases CSS para estilos (sin inline styles)
- Clases de utilidad disponibles:
  - `.flex-grow` - flex: 1
  - `.p-2rem` - padding: 2rem
  - `.text-white-85` - color: rgba(255, 255, 255, 0.85)
  - `.text-white-90` - color: rgba(255, 255, 255, 0.9)

### Gestión de vistas
- Sistema de vistas con `.view-container` y `.view-container.active`
- Navegación mediante `data-view` en los links del menú
- Función `switchView()` para cambiar entre vistas

### Almacenamiento de datos
- Variable global `allTasks` para cache de tareas
- `filteredCompletedTasks` y `filteredRejectedTasks` para tareas filtradas
- Sincronización automática al crear/actualizar tareas

### Cálculo de semana
- La función `getCurrentWeekRange()` calcula el inicio y fin de la semana en curso
- Las tareas se comparan con este rango para determinar si pertenecen a la semana actual

## 🐛 Solución de problemas

### El backend no inicia
- Verifica que MySQL esté ejecutándose
- Comprueba los valores en `.env`
- Asegúrate de que el puerto 3000 esté disponible

### Las tareas no se guardan
- Verifica la conexión a la base de datos
- Revisa la consola del navegador para errores
- Comprueba los logs del backend

### El filtro no funciona
- Asegúrate de que estés en la vista completa (Completadas/Rechazadas)
- Verifica que haya tareas para filtrar
- Intenta escribir parte del título de una tarea existente

## 📧 Contacto y soporte

Para reportar errores o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización**: Mayo 2026
