import { Router } from 'express';
import {
  getLabs,
  getStandards,
  getStandardById,
  searchStandards,
  findApplicableStandard,
  getSchemes,
  getSchemeById,
  getUpdates,
  compareStandards,
} from '../controllers/publicController.js';

const router = Router();

// Labs
router.get('/labs', getLabs);

// Standards
router.get('/standards', getStandards);
router.get('/standards/search', searchStandards);
router.get('/standards/:id', getStandardById);
router.post('/standards/find-applicable', findApplicableStandard);
router.get('/standards/compare', compareStandards);

// Schemes
router.get('/schemes', getSchemes);
router.get('/schemes/:id', getSchemeById);

// Updates
router.get('/updates', getUpdates);

export default router;
