import { Router } from 'express';
import todoRoutes from './todo';
import personRoutes from './person';

const router = Router();

router.use('/todos', todoRoutes);
router.use('/user', personRoutes);

export default router;