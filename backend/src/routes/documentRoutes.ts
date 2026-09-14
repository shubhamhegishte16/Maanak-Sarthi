import { Router, Request, Response } from 'express';
import multer from 'multer';
import { analyzeDocument, askDocumentQuestion, getDocuments } from '../controllers/documentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

router.post('/analyze', optionalAuth, upload.single('file'), (req: Request, res: Response) => analyzeDocument(req, res));
router.post('/:id/ask', (req: Request, res: Response) => askDocumentQuestion(req, res));
router.post('/ask', (req: Request, res: Response) => askDocumentQuestion(req, res));
router.get('/', optionalAuth, (req: Request, res: Response) => getDocuments(req, res));

export default router;
