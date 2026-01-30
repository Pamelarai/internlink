import { prisma } from './src/libs/prisma.js';

async function main() {
    try {
        const updatedUser = await prisma.user.update({
            where: { email: 'ram@gmail.com' },
            data: { role: 'ADMIN' }
        });
        console.log('User updated to ADMIN:', updatedUser.email);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
