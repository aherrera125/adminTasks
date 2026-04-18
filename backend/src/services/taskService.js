import { getAllTasks, createTask as createTaskModel } from '../models/taskModel.js';

export const listTasks = async () => {
  return await getAllTasks();
};

export const createTask = async (taskData) => {
  return await createTaskModel(taskData);
};
