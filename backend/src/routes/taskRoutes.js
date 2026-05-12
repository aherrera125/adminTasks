import express from 'express';
import { getTasks, createTask, updateTaskStatus, updateTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id/status', updateTaskStatus);
router.put('/:id', updateTask);

export default router;