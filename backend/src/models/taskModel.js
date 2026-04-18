import { pool } from '../../config/db.js';

export const getAllTasks = async () => {
  const [rows] = await pool.query(
    `SELECT id, title, description, due_date, status, created_at, updated_at FROM tasks`
  );
  return rows;
};

export const createTask = async ({ title, description, due_date }) => {
  const [result] = await pool.query(
    `INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, 'pending')`,
    [title, description, due_date]
  );

  const [rows] = await pool.query(
    `SELECT id, title, description, due_date, status, created_at, updated_at FROM tasks WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};
