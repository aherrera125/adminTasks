import express from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id/status', updateTaskStatus);

export default router;