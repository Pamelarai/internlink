import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
} from '../controllers/notificationController.js';

// Protected routes
router.use(authenticateToken);

// Get user's notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Create notification (internal use, but exposed for testing)
router.post('/', createNotification);

export default router;
