import { prisma } from '../libs/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const signupIntern = async (req, res) => {
	try {
		const { fullName, email, password, university, major, graduationYear } = req.body

		if (!email || !password || !fullName || !university || !major) {
			return sendError(res, 'Missing required fields', 400)
		}

		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return sendError(res, 'Email already registered', 409)
		}

		const user = await prisma.user.create({
			data: {
				email,
				password,
				role: 'INTERN',
				internProfile: {
					create: {
						fullName,
						university,
						major,
						graduationYear: graduationYear ? Number(graduationYear) : null
					}
				}
			},
			include: { internProfile: true }
		})

		console.log(`Intern user created: ${user.email}`)
		return sendSuccess(res, { user }, 'Signup successful', 201)
	} catch (err) {
		console.error('Intern signup error:', err)
		return sendError(res, 'Server error', 500)
	}
}

export const signupProvider = async (req, res) => {
	try {
		const { companyName, email, password, industry, website } = req.body

		if (!email || !password || !companyName || !industry) {
			return sendError(res, 'Missing required fields', 400)
		}

		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return sendError(res, 'Email already registered', 409)
		}

		const user = await prisma.user.create({
			data: {
				email,
				password,
				role: 'PROVIDER',
				providerProfile: {
					create: {
						companyName,
						industry,
						website: website || null
					}
				}
			},
			include: { providerProfile: true }
		})

		console.log(`Provider user created: ${user.email}`)
		return sendSuccess(res, { user }, 'Signup successful', 201)
	} catch (err) {
		console.error('Provider signup error:', err)
		return sendError(res, 'Server error', 500)
	}
}
