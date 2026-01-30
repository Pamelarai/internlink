import express from 'express'
import * as adminController from '../controllers/adminController.js'
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require admin role
router.use(authenticateToken)
router.use(authorizeAdmin)

router.get('/stats', adminController.getStats)
router.get('/users', adminController.getUsers)
router.put('/users/:id/block', adminController.toggleBlockUser)
router.delete('/users/:id', adminController.deleteUser)

router.get('/internships', adminController.getInternships)
router.put('/internships/:id/approve', adminController.approveInternship)
router.put('/internships/:id/reject', adminController.rejectInternship)

router.get('/applications', adminController.getApplications)

router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.addCategory)
router.delete('/categories/:id', adminController.deleteCategory)

router.get('/skills', adminController.getSkills)
router.post('/skills', adminController.addSkill)
router.delete('/skills/:id', adminController.deleteSkill)

export default router
