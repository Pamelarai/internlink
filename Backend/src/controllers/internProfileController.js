import { prisma } from '../libs/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getMyInternProfile = async (req, res) => {
	try {
		const userId = req.user.id

		const profile = await prisma.internProfile.findUnique({
			where: { userId }
		})

		if (!profile) {
			return sendError(res, 'Profile not found', 404)
		}

		return sendSuccess(res, { profile }, 'Profile retrieved successfully')
	} catch (err) {
		console.error('Get intern profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}

export const updateInternProfile = async (req, res) => {
	try {
		const userId = req.user.id
		const {
			fullName,
			university,
			major,
			graduationYear,
			skills,
			bio,
			resumeUrl,
			portfolioUrl,
			githubUrl,
			linkedinUrl
		} = req.body

		if (!fullName || !university || !major) {
			return sendError(res, 'Full name, university, and major are required', 400)
		}

		const profile = await prisma.internProfile.upsert({
			where: { userId },
			update: {
				fullName,
				university,
				major,
				graduationYear: graduationYear ? Number(graduationYear) : null,
				skills: skills || null,
				bio: bio || null,
				resumeUrl: resumeUrl || null,
				portfolioUrl: portfolioUrl || null,
				githubUrl: githubUrl || null,
				linkedinUrl: linkedinUrl || null
			},
			create: {
				userId,
				fullName,
				university,
				major,
				graduationYear: graduationYear ? Number(graduationYear) : null,
				skills: skills || null,
				bio: bio || null,
				resumeUrl: resumeUrl || null,
				portfolioUrl: portfolioUrl || null,
				githubUrl: githubUrl || null,
				linkedinUrl: linkedinUrl || null
			}
		})

		console.log(`Intern profile updated: ${profile.fullName}`)
		return sendSuccess(res, { profile }, 'Profile updated successfully')
	} catch (err) {
		console.error('Update intern profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}

// Get intern profile (for providers to view)
export const getInternProfile = async (req, res) => {
	try {
		const { internId } = req.params

		const profile = await prisma.internProfile.findUnique({
			where: { id: parseInt(internId) },
			include: {
				user: {
					select: {
						email: true,
						createdAt: true
					}
				}
			}
		})

		if (!profile) {
			return sendError(res, 'Intern profile not found', 404)
		}

		return sendSuccess(res, { profile }, 'Intern profile retrieved successfully')
	} catch (err) {
		console.error('Get intern profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}
