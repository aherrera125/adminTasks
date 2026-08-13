# Frontend - Admin Tasks

Interfaz de una sola página para la gestión de tareas administrativas, construida con **JavaScript vanilla** y **Bootstrap 5** (desde CDN), sin paso de build. La UI muestra las tareas por estado (pendientes, completadas, rechazadas) con vistas dedicadas, búsqueda en tiempo real, paginación y modales para crear/editar/actualizar tareas.

> El frontend **no** se ejecuta por separado: lo sirve estáticamente el backend (`backend/src/app.js`). Ejecuta `npm run dev` dentro de `backend/` y abre `http://localhost:3000`. El `npm start` del frontend (http-server en el puerto 8080) rompe todas las llamadas a `/api/tasks` — no usarlo.

## Tecnologías

- **JavaScript vanilla** (ES6+) - Sin frameworks
- **Bootstrap 5.3.0** - CSS y JS desde CDN
- **CSS personalizado** - Tema oscuro con variables CSS
- **http-server** - DevDependency vestigial (no usar, ver nota de arriba)

## Estructura

```
frontend/
├── index.html                   # Estructura HTML (navbar, vistas, modales)
├── package.json
├── js/
│   └── app.js                   # Toda la lógica de la aplicación
└── css/
    └── style.css                # Tema oscuro + estilos de tarjetas, grid y paginación
```

## Vistas

La navegación se maneja con `.view-container` y la clase `.active`, mediante la función `switchView()` (`js/app.js`). Los links del menú usan el atributo `data-view`.

### Inicio (`view-home`)
- **Tres columnas de tareas:**
  - 📋 **Pendientes**: todas, ordenadas por fecha de vencimiento ascendente
  - ✅ **Completadas (Esta Semana)**: solo las de la semana en curso
  - ❌ **Rechazadas (Esta Semana)**: solo las de la semana en curso
- El rango semanal se calcula con `getCurrentWeekRange()` (la semana inicia en domingo) y se valida con `isTaskFromCurrentWeek()`.
- Cada tarjeta muestra título, fecha de vencimiento (resaltada en rojo si ya pasó) y un botón **Detalle** que abre el modal.
- Mensaje de "No hay tareas..." cuando una columna está vacía.

### Completadas (`view-completed`)
- **Grid responsivo** (`tasks-grid`) con todas las tareas completadas, sin importar la semana.
- **Filtro en tiempo real** por título (`#filter-completed-input`).
- **Paginación** de 12 tareas por página (`ITEMS_PER_PAGE`), con botones `← Anterior`, números de página y `Siguiente →`.
- Cada tarjeta muestra título, descripción (primeros 100 caracteres) y fecha; el botón **Ver Detalle** abre el modal.

### Rechazadas (`view-rejected`)
- Misma estructura que Completadas, con su propio filtro (`#filter-rejected-input`) y paginación independiente.
- Las tarjetas comparten estilo oscuro con el resto de la app.

## Modales

### Modal de Detalle (`#taskDetailModal`)
Abierto desde cualquier tarjeta. Muestra título, descripción, fecha de vencimiento y acciones. Para tareas **pendientes** permite:
- **Editar** la descripción (botón que alterna entre "Editar"/"Guardar" y reemplaza el párrafo por un `<textarea>`).
- **✓ Completada**: cambia el estado vía `PUT /api/tasks/:id/status`.
- **✗ Rechazada**: cambia el estado vía el mismo endpoint.

Para tareas completadas/rechazadas el modal es solo de lectura (no muestra acciones).

### Modal de Agregar Tarea (`#addTaskModal`)
Formulario con título, fecha de vencimiento y descripción. Al enviar valida que los tres campos estén completos, llama a `POST /api/tasks` y recarga las tareas.

## Funcionalidades clave (`js/app.js`)

- **`fetchTasks()`**: obtiene las tareas de `GET /api/tasks`, las guarda en la variable global `allTasks` y renderiza todas las vistas.
- **`renderTasks()` / `renderTaskGroup()`**: separa por estado, ordena por fecha de vencimiento (ascendente) y renderiza las columnas de la vista Home.
- **`renderAllTasksView()`**: renderiza el grid de las vistas completas con paginación (12 por página).
- **`renderPagination()` / `handlePageClick()`**: generan los botones de paginación y navegan entre páginas, manteniendo la página por contenedor.
- **`filterTasksByTitle()`**: filtro case-insensitive por título.
- **`updateCompletedTasksView()` / `updateRejectedTasksView()`**: combinan filtro + paginación; resetean a página 1 solo si cambia el término de búsqueda (`lastCompletedSearchText` / `lastRejectedSearchText`).
- **`updateStatus()`**: actualiza el estado de una tarea y recarga las vistas.
- **`openTaskDetail()` / `renderTaskDetailModal()`**: controlan el modal de detalle.
- **`toggleTaskDescriptionEditMode()` / `updateTaskDescription()`**: edición de descripción vía `PUT /api/tasks/:id`.
- **`createTask()`**: crea una tarea vía `POST /api/tasks`.
- **`sortByDueDate()`**: ordena tareas por fecha de vencimiento (opcionalmente descendente).

## Estilos (`css/style.css`)

- **Tema oscuro** con variables CSS (`--bg`, `--surface`, `--accent`, etc.) y tarjetas con `box-shadow` y efectos hover (`translateY`).
- **Grid responsive** para las vistas completas: `repeat(auto-fill, minmax(300px, 1fr))`, colapsando a 1 columna en móvil (`@media max-width: 767px`).
- **Modales personalizados** oscuros con inputs acordes al tema.
- **Paginación** con botones `.pagination-button`, estado `.active` y `:disabled`.
- **Clases de utilidad**: `.flex-grow`, `.p-2rem`, `.text-white-85`, `.text-white-90`.

## Notas de desarrollo

- Los `console.log` de depuración en `js/app.js` son intencionales y deben dejarse en su lugar.
- No hay tests ni lint en este repo.
- Todo el texto de la UI está en español.
