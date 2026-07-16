import { Router } from 'express';
import * as ctrl from './plans.controller';

const router = Router();
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
export default router;
