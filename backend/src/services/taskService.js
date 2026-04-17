import { getAllTasks } from '../models/taskModel.js';

export const listTasks = async () => {
  return await getAllTasks();
};
