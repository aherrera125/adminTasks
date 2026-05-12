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

export const updateTask = async (id, { description }) => {
  const [result] = await pool.query(
    `UPDATE tasks SET description = ?, updated_at = NOW() WHERE id = ?`,
    [description, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    `SELECT id, title, description, due_date, status, created_at, updated_at FROM tasks WHERE id = ?`,
    [id]
  );

  return rows[0];
};

export const updateTaskStatus = async (id, status) => {
  console.log('updateTaskStatus called with:', { id, status, type: typeof id });
  const [result] = await pool.query(
    `UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?`,
    [status, id]
  );

  console.log('Update result:', result);

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    `SELECT id, title, description, due_date, status, created_at, updated_at FROM tasks WHERE id = ?`,
    [id]
  );

  return rows[0];
};
