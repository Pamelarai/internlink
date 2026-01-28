import { prisma } from '../libs/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

// Get company profile (for seekers to view)
export const getCompanyProfile = async (req, res) => {
	try {
		const { companyId } = req.params

		const companyProfile = await prisma.providerProfile.findUnique({
			where: { id: parseInt(companyId) },
			include: {
				user: {
					select: {
						email: true,
						createdAt: true
					}
				},
				internships: {
					where: { status: 'OPEN' },
					select: {
						id: true,
						title: true,
						category: true,
						location: true,
						createdAt: true
					},
					orderBy: { createdAt: 'desc' },
					take: 5
				}
			}
		})

		if (!companyProfile) {
			return sendError(res, 'Company not found', 404)
		}

		return sendSuccess(res, { company: companyProfile }, 'Company profile retrieved successfully')
	} catch (err) {
		console.error('Get company profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}

// Get all companies (for seekers to browse)
export const getAllCompanies = async (req, res) => {
	try {
		const companies = await prisma.providerProfile.findMany({
			select: {
				id: true,
				companyName: true,
				industry: true,
				location: true,
				description: true,
				logo: true,
				website: true,
				internships: {
					where: { status: 'OPEN' },
					select: { id: true }
				}
			},
			orderBy: { companyName: 'asc' }
		})

		return sendSuccess(res, { companies }, 'Companies retrieved successfully')
	} catch (err) {
		console.error('Get all companies error:', err)
		return sendError(res, 'Server error', 500)
	}
}

// Update company profile (for providers)
export const updateCompanyProfile = async (req, res) => {
	try {
		const userId = req.user.id
		const {
			companyName,
			industry,
			website,
			description,
			logo,
			location,
			companySize,
			foundedYear,
			socialLinks,
			mission,
			vision
		} = req.body

		// Get the provider profile
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { providerProfile: true }
		})

		if (!user || user.role !== 'PROVIDER' || !user.providerProfile) {
			return sendError(res, 'Provider profile not found', 404)
		}

		// Update the profile
		const updatedProfile = await prisma.providerProfile.update({
			where: { id: user.providerProfile.id },
			data: {
				companyName: companyName || user.providerProfile.companyName,
				industry: industry || user.providerProfile.industry,
				website: website || user.providerProfile.website,
				description: description || user.providerProfile.description,
				logo: logo || user.providerProfile.logo,
				location: location || user.providerProfile.location,
				companySize: companySize || user.providerProfile.companySize,
				foundedYear: foundedYear ? parseInt(foundedYear) : user.providerProfile.foundedYear,
				socialLinks: socialLinks || user.providerProfile.socialLinks,
				mission: mission || user.providerProfile.mission,
				vision: vision || user.providerProfile.vision
			},
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})

		console.log(`Company profile updated: ${updatedProfile.companyName}`)
		return sendSuccess(res, { company: updatedProfile }, 'Company profile updated successfully')
	} catch (err) {
		console.error('Update company profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}

// Get current user's company profile (for providers)
export const getMyCompanyProfile = async (req, res) => {
	try {
		const userId = req.user.id

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				providerProfile: {
					include: {
						internships: {
							select: {
								id: true,
								title: true,
								status: true,
								createdAt: true
							},
							orderBy: { createdAt: 'desc' }
						}
					}
				}
			}
		})

		if (!user || user.role !== 'PROVIDER' || !user.providerProfile) {
			return sendError(res, 'Provider profile not found', 404)
		}

		return sendSuccess(res, { company: user.providerProfile }, 'Company profile retrieved successfully')
	} catch (err) {
		console.error('Get my company profile error:', err)
		return sendError(res, 'Server error', 500)
	}
}
