// Función para obtener tareas desde el backend
async function fetchTasks() {
  console.log('=== INICIANDO FETCHTASKS ===');
  try {
    const response = await fetch('http://localhost:3000/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Tareas obtenidas:', data);
    console.log('Data.data:', data.data);
    renderTasks(data.data || []);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
  }
}

// Función para renderizar tareas
function renderTasks(tasks) {
  console.log('Renderizando tareas:', tasks);
  if (!Array.isArray(tasks)) {
    console.error('Tasks no es un array:', tasks);
    return;
  }
  // Separar tareas por status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const rejectedTasks = tasks.filter(task => task.status === 'rejected');

  console.log('Pendientes:', pendingTasks.length, 'Completadas:', completedTasks.length, 'Rechazadas:', rejectedTasks.length);
  console.log('Tareas pendientes:', JSON.stringify(pendingTasks));

  // Renderizar cada grupo
  renderTaskGroup(pendingTasks, 'pending-tasks-container');
  renderTaskGroup(completedTasks, 'completed-tasks-container');
  renderTaskGroup(rejectedTasks, 'rejected-tasks-container');
}

// Función para renderizar un grupo de tareas en un contenedor
function renderTaskGroup(taskList, containerId) {
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
    // Si es el grupo de pendientes y no hay tareas
    if (containerId.includes('pending')) {
      container.innerHTML = '<p class="text-muted">No hay tareas pendientes.</p>';
    } else {
      container.innerHTML = '<p class="text-muted">No hay tareas.</p>';
    }
    return;
  }

  // Determinar si es el grupo de pendientes
  const isPending = containerId.includes('pending');
  console.log('Es grupo pendientes:', isPending);
  console.log('Container id:', containerId);

  // Crear cards para cada tarea
  taskList.forEach(task => {
    console.log('Renderizando tarea:', task.id, task.status);
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-2';
    
    let buttonsHtml = '';
    console.log('isPending para tarea', task.id, ':', isPending);
    if (isPending) {
      buttonsHtml = `
        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-success btn-sm" onclick="updateStatus(${task.id}, 'completed')">Completada</button>
          <button class="btn btn-danger btn-sm" onclick="updateStatus(${task.id}, 'rejected')">Rechazada</button>
        </div>
      `;
    }
    
    taskCard.innerHTML = `
      <div class="card-body">
        <h6 class="card-title">${task.title}</h6>
        <p class="card-text">${task.description}</p>
        <small class="text-muted">Vence: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}</small>
        ${buttonsHtml}
      </div>
    `;
    console.log('Card HTML:', taskCard.innerHTML);
    container.appendChild(taskCard);
  });
}

// Función para actualizar el estado de una tarea
async function updateStatus(taskId, status) {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      alert(`Tarea marcada como ${status === 'completed' ? 'completada' : 'rechazada'}`);
      fetchTasks(); // Recargar las tareas
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    alert('Error al actualizar la tarea');
  }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchTasks);