const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create internship
const createInternship = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const {
      title,
      description,
      requirements,
      location,
      duration,
      stipend,
      applicationDeadline,
    } = req.body;

    const internship = await prisma.internship.create({
      data: {
        providerId: providerProfile.id,
        title,
        description,
        requirements,
        location,
        duration,
        stipend: stipend ? parseFloat(stipend) : null,
        applicationDeadline: new Date(applicationDeadline),
      },
    });

    res.status(201).json(internship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ error: 'Failed to create internship' });
  }
};

// Get all internships for provider
const getProviderInternships = async (req, res) => {
  try {
    const userId = req.user.id;

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const internships = await prisma.internship.findMany({
      where: { providerId: providerProfile.id },
      include: {
        applications: {
          include: {
            intern: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
};

// Get all internships (public)
const getAllInternships = async (req, res) => {
  try {
    const internships = await prisma.internship.findMany({
      where: { status: 'OPEN' },
      include: {
        provider: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
};

// Update internship
const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const internship = await prisma.internship.findFirst({
      where: {
        id: parseInt(id),
        providerId: providerProfile.id,
      },
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const updateData = req.body;
    if (updateData.applicationDeadline) {
      updateData.applicationDeadline = new Date(updateData.applicationDeadline);
    }
    if (updateData.stipend) {
      updateData.stipend = parseFloat(updateData.stipend);
    }

    const updatedInternship = await prisma.internship.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ error: 'Failed to update internship' });
  }
};

// Delete internship
const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const internship = await prisma.internship.findFirst({
      where: {
        id: parseInt(id),
        providerId: providerProfile.id,
      },
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    await prisma.internship.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ error: 'Failed to delete internship' });
  }
};

module.exports = {
  createInternship,
  getProviderInternships,
  getAllInternships,
  updateInternship,
  deleteInternship,
};
