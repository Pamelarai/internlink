import { prisma } from './src/libs/prisma.js';

async function main() {
    const adminEmail = 'admin@internlink.com';
    const adminPassword = 'adminpassword';

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: adminPassword,
                role: 'ADMIN'
            },
            create: {
                email: adminEmail,
                password: adminPassword,
                role: 'ADMIN'
            }
        });

        console.log('Admin user created/updated:', admin.email);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
