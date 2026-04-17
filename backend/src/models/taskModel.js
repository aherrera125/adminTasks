import { pool } from '../../config/db.js';

export const getAllTasks = async () => {
  const [rows] = await pool.query(
    `SELECT id, title, description, due_date, status, created_at, updated_at FROM tasks`
  );
  return rows;
};
