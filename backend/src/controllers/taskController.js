import { listTasks } from '../services/taskService.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await listTasks();
    return res.json({ ok: true, data: tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error fetching tasks' });
  }
};
