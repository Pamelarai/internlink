import { prisma } from '../libs/prisma.js'
import { generateToken } from '../utils/auth.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return sendError(res, 'Email and password required', 400)
		}

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) {
			return sendError(res, 'Invalid credentials', 401)
		}

		if (user.password !== password) {
			return sendError(res, 'Invalid credentials', 401)
		}

		const token = generateToken(user.id, user.role)

		console.log(`User logged in: ${user.email}`)
		return sendSuccess(res, { token, user: { id: user.id, email: user.email, role: user.role } }, 'Login successful')
	} catch (err) {
		console.error('Login error:', err)
		return sendError(res, 'Server error', 500)
	}
}
