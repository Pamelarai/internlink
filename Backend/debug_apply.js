import { prisma } from './src/libs/prisma.js';

async function testApply() {
    try {
        const internshipId = 2; // Change to a valid one if possible
        const internId = 1;

        console.log('Fetching internship...');
        const internship = await prisma.internship.findUnique({
            where: { id: internshipId },
            include: { provider: true }
        });

        if (!internship) {
            console.log('Internship not found');
            return;
        }

        console.log('Creating application...');
        const application = await prisma.application.create({
            data: {
                internshipId: internship.id,
                internId: internId,
                coverLetter: 'Test cover letter',
                resume: 'test.pdf',
                phone: '1234567890',
                availability: 'Immediate',
                projectLink: 'https://test.com'
            }
        });

        console.log('Application created:', application);

        console.log('Creating notification...');
        await prisma.notification.create({
            data: {
                userId: internship.provider.userId,
                message: 'Test notification'
            }
        });

        console.log('Test successful');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit(0);
    }
}

testApply();
