import { getAllTasks, createTask as createTask, updateTaskStatus, updateTask as updateTaskModel } from '../models/taskModel.js';

export const listTasks = async () => {
  return await getAllTasks();
};

export const addTask = async (taskData) => {
  return await createTask(taskData);
};

export const changeTaskStatus = async (id, status) => {
  const validStatuses = ['pending', 'completed', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status. Must be: pending, completed, or rejected');
  }
  return await updateTaskStatus(id, status);
};

export const updateTaskDescription = async (id, description) => {
  return await updateTaskModel(id, { description });
};
