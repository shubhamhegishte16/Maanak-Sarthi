import { Router } from 'express';
import {
  getUsers,
  getStandards,
  createStandard,
  getLabs,
  createLab,
  getSchemes,
  createScheme,
  getQcos,
  createQco,
  getDocuments,
  createDocument,
  getLogs
} from '../controllers/adminController.js';

// In a real application, you would add an admin authentication middleware here,
// e.g., requireAuth + requireAdminRole
// For this completion task, we will keep it simple and accessible to match existing auth flow.
const router = Router();

router.get('/users', getUsers);

router.get('/standards', getStandards);
router.post('/standards', createStandard);

router.get('/labs', getLabs);
router.post('/labs', createLab);

router.get('/schemes', getSchemes);
router.post('/schemes', createScheme);

router.get('/qcos', getQcos);
router.post('/qcos', createQco);

router.get('/documents', getDocuments);
router.post('/documents', createDocument);

router.get('/logs', getLogs);

export default router;
