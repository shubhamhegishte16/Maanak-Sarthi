import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
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
  getLogs,
  getDashboardStats,
  getRecentActivity,
  getFailedDocuments,
  retryDocument,
  getIngestionJobs,
  getLowConfidenceReviews,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getAlerts
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/standards', getStandards);
router.post('/standards', createStandard);

router.get('/labs', getLabs);
router.post('/labs', createLab);

router.get('/schemes', getSchemes);
router.post('/schemes', createScheme);

router.get('/qcos', getQcos);
router.post('/qcos', createQco);

router.get('/documents', getDocuments);
router.get('/documents/failed', getFailedDocuments);
router.post('/documents', createDocument);
router.post('/documents/:id/retry', retryDocument);

router.get('/ingestion/jobs', getIngestionJobs);
router.get('/reviews/low-confidence', getLowConfidenceReviews);
router.get('/faqs', getFaqs);
router.post('/faqs', createFaq);
router.patch('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);
router.get('/alerts', getAlerts);
router.get('/logs', getLogs);

export default router;
