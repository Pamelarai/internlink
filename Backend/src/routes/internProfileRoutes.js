import { Router } from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import {
	getMyInternProfile,
	updateInternProfile
} from '../controllers/internProfileController.js'

const router = Router()

// Protected routes (for interns)
router.get('/my/profile', authenticateToken, getMyInternProfile)
router.put('/my/profile', authenticateToken, updateInternProfile)

export default router
