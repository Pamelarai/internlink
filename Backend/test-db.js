import { prisma } from './src/libs/prisma.js';
import fs from 'fs';

async function test() {
    try {
        const intern = await prisma.internProfile.findFirst();
        const internship = await prisma.internship.findFirst();

        if (intern && internship) {
            await prisma.application.create({
                data: {
                    internshipId: internship.id,
                    internId: intern.id,
                    coverLetter: 'Test',
                    resume: 'test.pdf',
                    whyMe: 'Test',
                    availability: 'Test',
                    phoneNumber: '123'
                }
            });
        }
    } catch (err) {
        fs.writeFileSync('prisma-error.txt', err.message);
    } finally {
        process.exit();
    }
}

test();
