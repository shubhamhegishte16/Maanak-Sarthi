import { Router } from 'express';
import { getLabs, searchStandards } from '../controllers/publicController.js';

const router = Router();

router.get('/labs', getLabs);
router.get('/standards/search', searchStandards);

export default router;
