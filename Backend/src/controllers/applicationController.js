const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Apply for an internship
const applyForInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter, resume } = req.body;
    const internId = req.user.internProfile.id;

    // Check if internship exists and is open
    const internship = await prisma.internship.findUnique({
      where: { id: parseInt(internshipId) },
    });

    if (!internship || internship.status !== 'OPEN') {
      return res.status(400).json({ message: 'Internship not available for application' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        internshipId: parseInt(internshipId),
        internId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this internship' });
    }

    const application = await prisma.application.create({
      data: {
        internshipId: parseInt(internshipId),
        internId,
        coverLetter,
        resume,
      },
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error applying for internship:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get applications for provider's internships
const getProviderApplications = async (req, res) => {
  try {
    const providerId = req.user.providerProfile.id;

    const applications = await prisma.application.findMany({
      where: {
        internship: {
          providerId,
        },
      },
      include: {
        internship: true,
        intern: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get intern's applications
const getInternApplications = async (req, res) => {
  try {
    const internId = req.user.internProfile.id;

    const applications = await prisma.application.findMany({
      where: { internId },
      include: {
        internship: {
          include: {
            provider: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update application status (accept/reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const providerId = req.user.providerProfile.id;

    const application = await prisma.application.updateMany({
      where: {
        id: parseInt(id),
        internship: {
          providerId,
        },
      },
      data: { status },
    });

    if (application.count === 0) {
      return res.status(404).json({ message: 'Application not found or not authorized' });
    }

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  applyForInternship,
  getProviderApplications,
  getInternApplications,
  updateApplicationStatus,
};
