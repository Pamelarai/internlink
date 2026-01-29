import { Router } from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import {
	getMyInternProfile,
	updateInternProfile,
	getInternProfile
} from '../controllers/internProfileController.js'

const router = Router()

// Public profile route (viewed by providers)
router.get('/:internId', authenticateToken, getInternProfile)

// Protected routes (for interns)
router.get('/my/profile', authenticateToken, getMyInternProfile)
router.put('/my/profile', authenticateToken, updateInternProfile)

export default router
