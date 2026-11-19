import { listTasks, addTask, changeTaskStatus, updateTaskDescription } from '../services/taskService.js';

const validStatuses = ['pending', 'completed', 'rejected'];

const parseTaskId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

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

    if (
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      !title.trim() ||
      !description.trim() ||
      title.trim().length > 255 ||
      !isValidDate(due_date)
    ) {
      return res.status(400).json({ ok: false, error: 'title, description and a valid due_date are required' });
    }

    const task = await addTask({ title: title.trim(), description: description.trim(), due_date });
    return res.status(201).json({ ok: true, data: task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error creating task' });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const taskId = parseTaskId(id);
    if (!taskId) {
      return res.status(400).json({ ok: false, error: 'Invalid task id' });
    }

    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ ok: false, error: 'description is required' });
    }

    const task = await updateTaskDescription(taskId, description.trim());

    if (!task) {
      return res.status(404).json({ ok: false, error: 'Task not found' });
    }

    return res.json({ ok: true, data: task });
  } catch (error) {
    console.error('=== ERROR ===');
    console.error(error.stack || error);
    return res.status(500).json({ ok: false, error: 'Error updating task description: ' + error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const taskId = parseTaskId(id);
    if (!taskId) {
      return res.status(400).json({ ok: false, error: 'Invalid task id' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status' });
    }

    const task = await changeTaskStatus(taskId, status);
    
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
