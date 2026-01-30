import { prisma } from '../libs/prisma.js';

// Apply for an internship
const applyForInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter, resume, phoneNumber, availability, portfolioUrl, githubUrl } = req.body;
    const userId = req.user.id;

    console.log('Application attempt:', { userId, internshipId });

    if (!internshipId) {
      return res.status(400).json({ message: 'Internship ID is required' });
    }

    // Check if user has an intern profile
    const internProfile = await prisma.internProfile.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!internProfile) {
      console.error('No intern profile found for userId:', userId);
      return res.status(404).json({ message: 'Intern profile not found. Please complete your profile first.' });
    }

    const internId = internProfile.id;

    // Check if internship exists and is open
    const internship = await prisma.internship.findUnique({
      where: { id: parseInt(internshipId) },
    });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.status !== 'OPEN') {
      return res.status(400).json({ message: 'Internship is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        internshipId: parseInt(internshipId),
        internId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }

    console.log('Creating application record...');
    const application = await prisma.application.create({
      data: {
        internshipId: parseInt(internshipId),
        internId,
        coverLetter: coverLetter || '',
        resume: resume || '',
        phoneNumber: phoneNumber || null,
        availability: availability || null,
        portfolioUrl: portfolioUrl || null,
        githubUrl: githubUrl || null,
      },
    });

    console.log('Application created successfully:', application.id);
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('CRITICAL: Error applying for internship:', error);
    res.status(500).json({
      message: 'Internal server error',
      details: error.message,
      code: error.code // Prisma error codes are helpful
    });
  }
};

// Get applications for provider's internships
const getProviderApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch provider profile first
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const applications = await prisma.application.findMany({
      where: {
        internship: {
          providerId: providerProfile.id,
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
      orderBy: { createdAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Get intern's applications
const getInternApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const internProfile = await prisma.internProfile.findUnique({
      where: { userId }
    });

    if (!internProfile) {
      return res.status(404).json({ error: 'Intern profile not found' });
    }

    const applications = await prisma.application.findMany({
      where: { internId: internProfile.id },
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
      orderBy: { createdAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Update application status (accept/reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    const application = await prisma.application.updateMany({
      where: {
        id: parseInt(id),
        internship: {
          providerId: providerProfile.id,
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
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};


export {
  applyForInternship,
  getProviderApplications,
  getInternApplications,
  updateApplicationStatus,
};
