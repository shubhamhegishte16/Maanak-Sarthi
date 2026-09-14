import { Router, Request, Response } from 'express';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = Router();

// Dashboard (supports both authenticated user stats and guest sample preview)
router.get('/dashboard', optionalAuth, (req: Request, res: Response) => userController.getDashboard(req, res));

// Saved Standards (Bookmarks)
router.get('/saved-standards', optionalAuth, (req: Request, res: Response) => userController.getSavedStandards(req, res));
router.post('/saved-standards/toggle', optionalAuth, (req: Request, res: Response) => userController.toggleSaveStandard(req, res));

// Tracked Products
router.get('/products', optionalAuth, (req: Request, res: Response) => userController.getProducts(req, res));
router.post('/products', optionalAuth, (req: Request, res: Response) => userController.createProduct(req, res));

// Application Readiness Checklist
router.get('/readiness', optionalAuth, (req: Request, res: Response) => userController.getReadiness(req, res));
router.post('/readiness/update', optionalAuth, (req: Request, res: Response) => userController.updateReadinessTask(req, res));

// Compliance Audit Checklist
router.get('/compliance', optionalAuth, (req: Request, res: Response) => userController.getComplianceAudit(req, res));
router.post('/compliance/save', optionalAuth, (req: Request, res: Response) => userController.saveComplianceAuditItem(req, res));

export default router;
