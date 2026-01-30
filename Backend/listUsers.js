import { prisma } from './src/libs/prisma.js';

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
