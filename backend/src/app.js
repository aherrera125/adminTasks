import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { pool } from '../config/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

app.get('/test-db', async (req, res) => {
  const [rows] = await pool.query('SELECT 1');
  res.json({ ok: true, rows });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});