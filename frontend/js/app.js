// Función para obtener tareas desde el backend
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Tareas obtenidas:', data);
    console.log('Llamando renderTasks con:', data.data);
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

  // Renderizar cada grupo
  renderTaskGroup(pendingTasks, '.pending-tasks .card-body');
  renderTaskGroup(completedTasks, '.completed-tasks .card-body');
  renderTaskGroup(rejectedTasks, '.rejected-tasks .card-body');
}

// Función para renderizar un grupo de tareas en un contenedor
function renderTaskGroup(taskList, containerSelector) {
  console.log('Renderizando grupo:', taskList.length, 'tareas en', containerSelector);
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Container no encontrado para selector:', containerSelector);
    return;
  }
  console.log('Container encontrado');

  // Limpiar contenido anterior
  container.innerHTML = '';

  if (taskList.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay tareas.</p>';
    return;
  }

  // Crear cards para cada tarea
  taskList.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-2';
    taskCard.innerHTML = `
      <div class="card-body">
        <h6 class="card-title">${task.title}</h6>
        <p class="card-text">${task.description}</p>
        <small class="text-muted">Vence: ${new Date(task.due_date).toLocaleDateString()}</small>
      </div>
    `;
    container.appendChild(taskCard);
  });
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchTasks);