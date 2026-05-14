// Variable global para almacenar todas las tareas
let allTasks = [];
let filteredCompletedTasks = [];
let filteredRejectedTasks = [];

// Función para determinar el inicio y fin de la semana en curso
function getCurrentWeekRange() {
  const today = new Date();
  const first = today.getDate() - today.getDay(); // Primer día de la semana (domingo)
  const last = first + 6; // Último día de la semana (sábado)
  
  const weekStart = new Date(today.setDate(first));
  const weekEnd = new Date(today.setDate(last));
  
  weekStart.setHours(0, 0, 0, 0);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

// Función para verificar si una tarea pertenece a la semana en curso
function isTaskFromCurrentWeek(task) {
  if (!task.due_date) return false;
  const taskDate = new Date(task.due_date);
  const { weekStart, weekEnd } = getCurrentWeekRange();
  return taskDate >= weekStart && taskDate <= weekEnd;
}

// Función para obtener tareas desde el backend
async function fetchTasks() {
  console.log('=== INICIANDO FETCHTASKS ===');
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Tareas obtenidas:', data);
    console.log('Data.data:', data.data);
    allTasks = data.data || [];
    renderTasks(allTasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
  }
}

// Función para ordenar tareas por fecha de vencimiento (ascendente - más próximas a vencer primero)
function sortByDueDate(tasks) {
  return tasks.sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  });
}

let currentModalTask = null;
let currentModalEditing = false;

// Función para renderizar tareas
function renderTasks(tasks) {
  console.log('Renderizando tareas:', tasks);
  if (!Array.isArray(tasks)) {
    console.error('Tasks no es un array:', tasks);
    return;
  }
  // Separar tareas por status
  let pendingTasks = tasks.filter(task => task.status === 'pending');
  let completedTasks = tasks.filter(task => task.status === 'completed');
  let rejectedTasks = tasks.filter(task => task.status === 'rejected');

  // Ordenar cada grupo por fecha de vencimiento
  pendingTasks = sortByDueDate(pendingTasks);
  completedTasks = sortByDueDate(completedTasks);
  rejectedTasks = sortByDueDate(rejectedTasks);

  console.log('Pendientes:', pendingTasks.length, 'Completadas:', completedTasks.length, 'Rechazadas:', rejectedTasks.length);
  console.log('Tareas pendientes:', JSON.stringify(pendingTasks));

  // Renderizar cada grupo - filtrar completadas y rechazadas por semana en vista home
  renderTaskGroup(pendingTasks, 'pending-tasks-container', false);
  renderTaskGroup(completedTasks.filter(task => isTaskFromCurrentWeek(task)), 'completed-tasks-container', false);
  renderTaskGroup(rejectedTasks.filter(task => isTaskFromCurrentWeek(task)), 'rejected-tasks-container', false);
  
  // Actualizar vistas completas con filtro
  updateCompletedTasksView();
  updateRejectedTasksView();
}

// Función para renderizar un grupo de tareas en un contenedor
function renderTaskGroup(taskList, containerId, isAllView = false) {
  console.log('Renderizando grupo:', taskList.length, 'tareas en', containerId);
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container no encontrado para id:', containerId);
    return;
  }
  console.log('Container encontrado');

  // Limpiar contenido anterior
  container.innerHTML = '';

  if (taskList.length === 0) {
    if (containerId.includes('pending')) {
      container.innerHTML = '<p class="text-muted">No hay tareas pendientes.</p>';
    } else if (containerId.includes('completed')) {
      container.innerHTML = '<p class="text-muted">No hay tareas completadas.</p>';
    } else if (containerId.includes('rejected')) {
      container.innerHTML = '<p class="text-muted">No hay tareas rechazadas.</p>';
    } else {
      container.innerHTML = '<p class="text-muted">No hay tareas.</p>';
    }
    return;
  }

  // Determinar si es el grupo de pendientes
  const isPending = containerId.includes('pending');
  const isCompleted = containerId.includes('completed');
  const isRejected = containerId.includes('rejected');
  
  console.log('Tipo grupo - Pendientes:', isPending, 'Completadas:', isCompleted, 'Rechazadas:', isRejected);

  // Crear cards para cada tarea
  taskList.forEach(task => {
    console.log('Renderizando tarea:', task.id, task.status);
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-2';
    
    let cardContent = '';
    if (isPending) {
      // Solo nombre, fecha y botón Detalle para tareas pendientes
      const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'Sin fecha';
      const dueDateClass = task.due_date ? (new Date(task.due_date) < new Date() ? 'text-danger fw-bold' : 'text-muted') : 'text-muted';
      
      cardContent = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow">
              <h6 class="card-title mb-2">${task.title}</h6>
              <small class="${dueDateClass}">📅 ${dueDate}</small>
            </div>
            <button type="button" class="btn btn-info btn-sm ms-2 task-detail-button">Detalle</button>
          </div>
        </div>
      `;
    } else if (isCompleted || isRejected) {
      const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'Sin fecha';
      const dueDateClass = task.due_date ? (new Date(task.due_date) < new Date() ? 'text-danger fw-bold' : 'text-muted') : 'text-muted';
      
      cardContent = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow">
              <h6 class="card-title mb-2">${task.title}</h6>
              <small class="${dueDateClass}">📅 ${dueDate}</small>
            </div>
            <button type="button" class="btn btn-info btn-sm ms-2 task-detail-button">Detalle</button>
          </div>
        </div>
      `;
    }
    
    taskCard.innerHTML = cardContent;
    const detailButton = taskCard.querySelector('.task-detail-button');
    if (detailButton) {
      detailButton.addEventListener('click', () => openTaskDetail(task.id, task.title, task.description, task.due_date, task.status));
    }
    console.log('Card HTML:', taskCard.innerHTML);
    container.appendChild(taskCard);
  });
}

// Función para renderizar todas las tareas en vista completa (grid)
function renderAllTasksView(taskList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (taskList.length === 0) {
    container.innerHTML = '<p class="text-muted text-center p-2rem">No hay tareas</p>';
    return;
  }

  // Ordenar por fecha
  const sortedTasks = sortByDueDate([...taskList]);

  const gridContainer = document.createElement('div');
  gridContainer.className = 'tasks-grid';

  sortedTasks.forEach(task => {
    const taskCard = document.createElement('div');
    // Determinar la clase según si es completada o rechazada
    const isCompleted = task.status === 'completed';
    const cardClass = isCompleted ? 'task-card task-card-completed' : 'task-card task-card-rejected';
    taskCard.className = cardClass;
    
    const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'Sin fecha';
    const isDueDatePassed = task.due_date && new Date(task.due_date) < new Date();
    const dueDateClass = isDueDatePassed ? 'text-danger fw-bold' : 'text-muted';

    taskCard.innerHTML = `
      <div>
        <h6 class="fw-bold mb-2">${task.title}</h6>
        <p class="small mb-2 text-white-85">${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}</p>
        <small class="text-white-90">📅 ${dueDate}</small>
      </div>
      <div class="mt-3">
        <button type="button" class="btn btn-sm btn-info task-detail-button-grid">Ver Detalle</button>
      </div>
    `;

    taskCard.addEventListener('click', (e) => {
      if (e.target.closest('.task-detail-button-grid')) {
        openTaskDetail(task.id, task.title, task.description, task.due_date, task.status);
      }
    });

    gridContainer.appendChild(taskCard);
  });

  container.appendChild(gridContainer);
}

// Función para filtrar tareas por título
function filterTasksByTitle(taskList, searchText) {
  if (!searchText.trim()) {
    return taskList;
  }
  return taskList.filter(task => 
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

// Función para actualizar la vista de tareas completadas
function updateCompletedTasksView() {
  const searchInput = document.getElementById('filter-completed-input');
  const searchText = searchInput ? searchInput.value : '';
  const completedTasks = allTasks.filter(task => task.status === 'completed');
  filteredCompletedTasks = filterTasksByTitle(completedTasks, searchText);
  renderAllTasksView(filteredCompletedTasks, 'all-completed-tasks-container');
}

// Función para actualizar la vista de tareas rechazadas
function updateRejectedTasksView() {
  const searchInput = document.getElementById('filter-rejected-input');
  const searchText = searchInput ? searchInput.value : '';
  const rejectedTasks = allTasks.filter(task => task.status === 'rejected');
  filteredRejectedTasks = filterTasksByTitle(rejectedTasks, searchText);
  renderAllTasksView(filteredRejectedTasks, 'all-rejected-tasks-container');
}

// Función para actualizar el estado de una tarea
async function updateStatus(taskId, status) {
  try {
    console.log('Actualizando tarea', taskId, 'a estado:', status);
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    console.log('Respuesta de actualización:', response.status, data);
    
    if (data.ok) {
      const statusMessage = status === 'completed' ? 'Completada' : status === 'rejected' ? 'Rechazada' : status;
      console.log(`Tarea ${taskId} marcada como ${statusMessage}`);
      fetchTasks(); // Recargar las tareas
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    alert('Error al actualizar la tarea');
  }
}

// Función para abrir el modal con detalles de la tarea
function openTaskDetail(taskId, title, description, dueDate, status) {
  console.log('Abriendo detalle de tarea:', { taskId, title, description, dueDate, status });
  currentModalTask = { taskId, title, description, dueDate, status };
  currentModalEditing = false;
  renderTaskDetailModal();

  const modal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
  modal.show();
}

function renderTaskDetailModal() {
  if (!currentModalTask) return;

  const dueDateFormatted = currentModalTask.dueDate ? new Date(currentModalTask.dueDate).toLocaleDateString('es-ES') : 'Sin fecha';
  const isDueDatePassed = currentModalTask.dueDate && new Date(currentModalTask.dueDate) < new Date();
  const isPending = currentModalTask.status === 'pending';

  const content = `
    <div>
      <div class="mb-3">
        <h6 class="text-muted">Título</h6>
        <p id="taskDetailTitle" class="fw-bold"></p>
      </div>
      <div class="mb-3">
        <h6 class="text-muted">Descripción</h6>
        <div id="taskDescriptionContainer"></div>
      </div>
      <div class="mb-3">
        <h6 class="text-muted">Fecha de Vencimiento</h6>
        <p id="taskDetailDueDate" class="${isDueDatePassed ? 'text-danger fw-bold' : ''}">📅 ${dueDateFormatted}</p>
      </div>
      <div class="d-flex gap-2 mb-3" id="taskDetailActions"></div>
    </div>
  `;

  const contentContainer = document.getElementById('taskDetailContent');
  contentContainer.innerHTML = content;
  document.getElementById('taskDetailTitle').textContent = currentModalTask.title;

  const descriptionContainer = document.getElementById('taskDescriptionContainer');
  if (currentModalEditing) {
    descriptionContainer.innerHTML = `<textarea id="taskDescriptionInput" class="form-control" rows="4">${currentModalTask.description}</textarea>`;
  } else {
    const paragraph = document.createElement('p');
    paragraph.textContent = currentModalTask.description;
    descriptionContainer.appendChild(paragraph);
  }

  const actionContainer = document.getElementById('taskDetailActions');
  actionContainer.innerHTML = '';

  if (isPending) {
    const editButton = document.createElement('button');
    editButton.id = 'editDescriptionBtn';
    editButton.type = 'button';
    editButton.className = currentModalEditing ? 'btn btn-primary' : 'btn btn-secondary';
    editButton.textContent = currentModalEditing ? 'Guardar' : 'Editar';
    editButton.addEventListener('click', toggleTaskDescriptionEditMode);
    actionContainer.appendChild(editButton);

    const completeButton = document.createElement('button');
    completeButton.id = 'completeFromModal';
    completeButton.type = 'button';
    completeButton.className = 'btn btn-success';
    completeButton.textContent = '✓ Completada';
    completeButton.addEventListener('click', () => {
      closeTaskDetailModal();
      updateStatus(currentModalTask.taskId, 'completed');
    });
    actionContainer.appendChild(completeButton);

    const rejectButton = document.createElement('button');
    rejectButton.id = 'rejectFromModal';
    rejectButton.type = 'button';
    rejectButton.className = 'btn btn-danger';
    rejectButton.textContent = '✗ Rechazada';
    rejectButton.addEventListener('click', () => {
      closeTaskDetailModal();
      updateStatus(currentModalTask.taskId, 'rejected');
    });
    actionContainer.appendChild(rejectButton);
  }
}

async function toggleTaskDescriptionEditMode() {
  if (!currentModalTask) return;

  if (!currentModalEditing) {
    currentModalEditing = true;
    renderTaskDetailModal();
    return;
  }

  const input = document.getElementById('taskDescriptionInput');
  if (!input) return;

  const newDescription = input.value.trim();
  if (!newDescription) {
    alert('La descripción no puede quedar vacía.');
    return;
  }

  if (newDescription === currentModalTask.description) {
    currentModalEditing = false;
    renderTaskDetailModal();
    return;
  }

  try {
    await updateTaskDescription(currentModalTask.taskId, newDescription);
    currentModalTask.description = newDescription;
    currentModalEditing = false;
    renderTaskDetailModal();
    fetchTasks();
    //alert('Descripción actualizada correctamente.');
  } catch (error) {
    console.error('Error guardando descripción:', error);
    alert('No se pudo actualizar la descripción.');
  }
}

async function updateTaskDescription(taskId, description) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error updating task description');
  }
  return data;
}

// Función para cerrar el modal de detalles
function closeTaskDetailModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('taskDetailModal'));
  if (modal) {
    modal.hide();
  }
}

// Función para crear una nueva tarea
async function createTask(taskData) {
  try {
    console.log('Creando tarea en backend:', taskData);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();
    console.log('Respuesta de creación:', response.status, data);

    if (!response.ok) {
      throw new Error(data.error || `Error creating task (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error;
  }
}

// Función para cambiar entre vistas
function switchView(viewName) {
  console.log('Cambiando a vista:', viewName);
  
  // Ocultar todas las vistas
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active');
  });

  // Mostrar la vista seleccionada
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Actualizar navegación activa
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const navLink = document.querySelector(`#nav-${viewName}`);
  if (navLink) {
    navLink.classList.add('active');
  }

  // Scroll al top
  window.scrollTo(0, 0);
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend listo, cargando tareas y configurando formulario');
  fetchTasks();

  // Configurar navegación
  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = e.target.getAttribute('data-view');
      switchView(viewName);
    });
  });

  // Configurar filtros de búsqueda
  const filterCompletedInput = document.getElementById('filter-completed-input');
  if (filterCompletedInput) {
    filterCompletedInput.addEventListener('input', updateCompletedTasksView);
  }

  const filterRejectedInput = document.getElementById('filter-rejected-input');
  if (filterRejectedInput) {
    filterRejectedInput.addEventListener('input', updateRejectedTasksView);
  }

  // Botón para abrir modal de agregar tarea
  const addTaskBtn = document.getElementById('add-task-btn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
      modal.show();
    });
  }

  const form = document.getElementById('create-task-form');
  if (!form) {
    console.error('Formulario de creación de tarea no encontrado');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Formulario enviar tarea');

    const title = document.getElementById('title')?.value.trim();
    const description = document.getElementById('description')?.value.trim();
    const due_date = document.getElementById('due_date')?.value;

    if (!title || !description || !due_date) {
      alert('Completa todos los campos antes de crear la tarea.');
      return;
    }

    try {
      console.log('Datos a enviar:', { title, description, due_date });
      await createTask({ title, description, due_date });
      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
      modal.hide();
      form.reset();
      fetchTasks();
    } catch (error) {
      alert(error.message || 'Error al crear la tarea');
    }
  });
});