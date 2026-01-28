
import express from 'express';
import {
    createInternship,
    getAllInternships,
    getProviderInternships,
    updateInternship,
    deleteInternship,
    publishInternship
} from '../controllers/internshipController.js';
import { authenticateToken, authorizeProvider } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllInternships);

// Protected routes (Provider only)
router.use(authenticateToken);
router.use(authorizeProvider);

router.post('/', createInternship);
router.get('/provider', getProviderInternships);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);
router.patch('/:id/publish', publishInternship);

export default router;
