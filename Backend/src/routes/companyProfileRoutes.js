import { Router } from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import {
	getCompanyProfile,
	getAllCompanies,
	updateCompanyProfile,
	getMyCompanyProfile
} from '../controllers/companyProfileController.js'

const router = Router()

// Public routes (for seekers)
router.get('/all', getAllCompanies)
router.get('/:companyId', getCompanyProfile)

// Protected routes (for providers)
router.get('/my/profile', authenticateToken, getMyCompanyProfile)
router.put('/my/profile', authenticateToken, updateCompanyProfile)

export default router
