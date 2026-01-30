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

        // Delete related profiles first to avoid foreign key constraints
        await prisma.internProfile.deleteMany({ where: { userId } })
        await prisma.providerProfile.deleteMany({ where: { userId } })
        // Note: Other relations like applications, notifications etc might still cause issues
        // but this covers the main ones. In a real app, onDelete: Cascade in Prisma is better.

        await prisma.user.delete({ where: { id: userId } })
        return sendSuccess(res, null, 'User deleted successfully')
    } catch (err) {
        console.error('Delete user error:', err)
        return sendError(res, 'Server error', 500)
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

export const getSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany()
        return sendSuccess(res, skills, 'Skills fetched successfully')
    } catch (err) {
        console.error('Get skills error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const addSkill = async (req, res) => {
    try {
        const { name } = req.body
        const skill = await prisma.skill.create({ data: { name } })
        return sendSuccess(res, skill, 'Skill added successfully')
    } catch (err) {
        console.error('Add skill error:', err)
        return sendError(res, 'Server error', 500)
    }
}

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.skill.delete({ where: { id: Number(id) } })
        return sendSuccess(res, null, 'Skill deleted successfully')
    } catch (err) {
        console.error('Delete skill error:', err)
        return sendError(res, 'Server error', 500)
    }
}
