import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  applyForInternship,
  getProviderApplications,
  getInternApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';

// Protected routes
router.use(authenticateToken);

// Apply for internship (intern only)
router.post('/apply', applyForInternship);

// Get provider's applications
router.get('/provider', getProviderApplications);

// Get intern's applications
router.get('/intern', getInternApplications);

// Update application status (provider only)
router.put('/:id/status', updateApplicationStatus);

export default router;
