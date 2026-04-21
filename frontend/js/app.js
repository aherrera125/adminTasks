// Función para obtener tareas desde el backend
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Tareas obtenidas:', data);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
  }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchTasks);