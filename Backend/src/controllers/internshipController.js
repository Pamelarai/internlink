import { prisma } from '../libs/prisma.js';

// Create internship
const createInternship = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    console.log('Creating internship for user ID:', userId);

    // Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      console.error('Provider profile not found for user:', userId);
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
      status,
      category,
      locationType,
      startDate,
      type,
      workingHours,
      hoursPerDay,
      numberOfOpenings,
      educationLevel,
      experienceRequired,
      aboutInternship,
      rolesResponsibilities,
      whatInternWillLearn,
      selectionProcess,
      certificate,
      jobOffer,
      otherBenefits,
      requiredSkills,
      companyName,
    } = req.body;

    // Validate required fields
    if (!title || !description || !requirements || !location || !duration || !applicationDeadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const internshipData = {
      providerId: providerProfile.id,
      title,
      description,
      requirements,
      location,
      locationType: locationType || 'Onsite',
      duration,
      stipend: stipend ? parseFloat(stipend) : null,
      applicationDeadline: new Date(applicationDeadline),
      startDate: startDate ? new Date(startDate) : null,
      status: status || 'OPEN',
      category: category || 'General',
      type: type || 'Unpaid',
      workingHours: workingHours || 'Full-time',
      hoursPerDay: hoursPerDay ? parseInt(hoursPerDay) : null,
      numberOfOpenings: numberOfOpenings ? parseInt(numberOfOpenings) : null,
      educationLevel,
      experienceRequired,
      aboutInternship,
      rolesResponsibilities,
      whatInternWillLearn,
      selectionProcess,
      certificate: certificate === true || certificate === 'on',
      jobOffer: jobOffer === true || jobOffer === 'on',
      otherBenefits,
      requiredSkills,
      companyName,
    };

    console.log('Attempting to create internship with data');

    const internship = await prisma.internship.create({
      data: internshipData,
    });

    console.log('Internship created successfully:', internship.id);
    res.status(201).json(internship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({
      error: 'Failed to create internship',
      details: error.message
    });
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

    const data = req.body;

    // Normalize data types
    const updateData = {
      ...data,
      stipend: data.stipend ? parseFloat(data.stipend) : null,
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      hoursPerDay: data.hoursPerDay ? parseInt(data.hoursPerDay) : undefined,
      numberOfOpenings: data.numberOfOpenings ? parseInt(data.numberOfOpenings) : undefined,
      certificate: data.certificate === true || data.certificate === 'on',
      jobOffer: data.jobOffer === true || data.jobOffer === 'on',
    };

    const updatedInternship = await prisma.internship.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ error: 'Failed to update internship', details: error.message });
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

export {
  createInternship,
  getProviderInternships,
  getAllInternships,
  updateInternship,
  deleteInternship,
};
