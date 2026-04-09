import { prisma } from '../libs/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getStats = async (req, res) => {
    try {
        const userCount = await prisma.user.count()
        const internshipCount = await prisma.internship.count()
        const applicationCount = await prisma.application.count()
        const providerCount = await prisma.user.count({ where: { role: 'PROVIDER' } })
        const internCount = await prisma.user.count({ where: { role: 'INTERN' } })

        return sendSuccess(res, {
            userCount,
            internshipCount,
            applicationCount,
            providerCount,
            internCount
        }, 'Stats fetched successfully')
    } catch (err) {
        console.error('Get stats error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                internProfile: true,
                providerProfile: true
            }
        })
        return sendSuccess(res, users, 'Users fetched successfully')
    } catch (err) {
        console.error('Get users error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({ where: { id: Number(id) } })
        if (!user) return sendError(res, 'User not found', 404)

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { isBlocked: !user.isBlocked }
        })

        return sendSuccess(res, updatedUser, `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`)
    } catch (err) {
        console.error('Toggle block error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const userId = Number(id)

        // 1. Delete global messages involving this user
        await prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } })

        // 2. Handle Intern Profile and its applications
        const internProfile = await prisma.internProfile.findUnique({ where: { userId } })
        if (internProfile) {
            const applications = await prisma.application.findMany({ where: { internId: internProfile.id } })
            const applicationIds = applications.map(app => app.id)
            
            // Delete messages linked to these applications
            await prisma.message.deleteMany({ where: { applicationId: { in: applicationIds } } })
            // Delete the applications themselves
            await prisma.application.deleteMany({ where: { internId: internProfile.id } })
            // Delete the profile
            await prisma.internProfile.delete({ where: { id: internProfile.id } })
        }

        // 3. Handle Provider Profile and its internships/applications
        const providerProfile = await prisma.providerProfile.findUnique({ where: { userId } })
        if (providerProfile) {
            const internships = await prisma.internship.findMany({ where: { providerId: providerProfile.id } })
            const internshipIds = internships.map(i => i.id)

            // Find all applications for these internships
            const applications = await prisma.application.findMany({ where: { internshipId: { in: internshipIds } } })
            const applicationIds = applications.map(app => app.id)

            // Delete messages linked to these internship applications
            await prisma.message.deleteMany({ where: { applicationId: { in: applicationIds } } })
            // Delete the applications
            await prisma.application.deleteMany({ where: { internshipId: { in: internshipIds } } })
            // Delete the internships
            await prisma.internship.deleteMany({ where: { providerId: providerProfile.id } })
            // Delete the provider profile
            await prisma.providerProfile.delete({ where: { id: providerProfile.id } })
        }

        // 4. Finally delete the user account
        await prisma.user.delete({ where: { id: userId } })
        
        return sendSuccess(res, null, 'User and all related data deleted successfully')
    } catch (err) {
        console.error('Delete user error:', err)
        return sendError(res, `Delete failed: ${err.message}`, 500)
    }
}

export const getInternships = async (req, res) => {
    try {
        const internships = await prisma.internship.findMany({
            include: {
                provider: true
            }
        })
        return sendSuccess(res, internships, 'Internships fetched successfully')
    } catch (err) {
        console.error('Get internships error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const approveInternship = async (req, res) => {
    try {
        const { id } = req.params
        const internship = await prisma.internship.update({
            where: { id: Number(id) },
            data: { isApproved: true }
        })
        return sendSuccess(res, internship, 'Internship approved successfully')
    } catch (err) {
        console.error('Approve internship error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const rejectInternship = async (req, res) => {
    try {
        const { id } = req.params
        const internship = await prisma.internship.update({
            where: { id: Number(id) },
            data: { isApproved: false }
        })
        return sendSuccess(res, internship, 'Internship rejected/unapproved successfully')
    } catch (err) {
        console.error('Reject internship error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const getApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            include: {
                intern: true,
                internship: {
                    include: {
                        provider: true
                    }
                }
            }
        })
        return sendSuccess(res, applications, 'Applications fetched successfully')
    } catch (err) {
        console.error('Get applications error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        return sendSuccess(res, categories, 'Categories fetched successfully')
    } catch (err) {
        console.error('Get categories error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const addCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await prisma.category.create({ data: { name } })
        return sendSuccess(res, category, 'Category added successfully')
    } catch (err) {
        console.error('Add category error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.category.delete({ where: { id: Number(id) } })
        return sendSuccess(res, null, 'Category deleted successfully')
    } catch (err) {
        console.error('Delete category error:', err)
        return sendError(res, 'Server error', 500)
    }
}



