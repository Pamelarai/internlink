
import { prisma } from '../libs/prisma.js';

async function checkUser() {
    try {
        const users = await prisma.user.findMany({
            include: {
                providerProfile: true
            }
        });
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
