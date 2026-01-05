const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
} = require('../controllers/notificationController');

// Protected routes
router.use(authenticateToken);

// Get user's notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Create notification (internal use, but exposed for testing)
router.post('/', createNotification);

module.exports = router;
