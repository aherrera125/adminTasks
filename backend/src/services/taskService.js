import { getAllTasks, createTask as createTask } from '../models/taskModel.js';

export const listTasks = async () => {
  return await getAllTasks();
};

export const addTask = async (taskData) => {
  return await createTask(taskData);
};
