import { listTasks, createTask } from '../services/taskService.js';

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

    const task = await createTask({ title, description, due_date });
    return res.status(201).json({ ok: true, data: task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error creating task' });
  }
};
