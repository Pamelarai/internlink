import { Router } from 'express'
import { signupIntern, signupProvider } from '../controllers/authSignupController.js'

const router = Router()

router.post('/intern/signup', signupIntern)
router.post('/provider/signup', signupProvider)

export default router
