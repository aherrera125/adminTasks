import { listTasks, addTask, changeTaskStatus } from '../services/taskService.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await listTasks();
    return res.json({ ok: true, data: tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error fetching tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    if (!title || !description || !due_date) {
      return res.status(400).json({ ok: false, error: 'title, description and due_date are required' });
    }

    const task = await addTask({ title, description, due_date });
    return res.status(201).json({ ok: true, data: task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error creating task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('=== UPDATE TASK STATUS ===');
  console.log('id:', id, 'type:', typeof id);
  console.log('status:', status);
  console.log('body:', req.body);

  try {
    const validStatuses = ['pending', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status' });
    }

    const task = await changeTaskStatus(id, status);
    console.log('Task after change:', task);
    
    if (!task) {
      return res.status(404).json({ ok: false, error: 'Task not found' });
    }

    return res.json({ ok: true, data: task });
  } catch (error) {
    console.error('=== ERROR ===');
    console.error(error.stack || error);
    return res.status(500).json({ ok: false, error: 'Error updating task status: ' + error.message });
  }
};
