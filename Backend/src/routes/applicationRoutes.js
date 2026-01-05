const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  applyForInternship,
  getProviderApplications,
  getInternApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

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

module.exports = router;
