import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../../frontend');

const app = express();

app.use(express.json());
app.use(express.static(frontendPath));
app.use('/api/tasks', taskRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ ok: true, rows });
  } catch (error) {
    console.error('Error comprobando la base de datos:', error);
    res.status(503).json({ ok: false, error: 'No se pudo conectar a la base de datos' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});