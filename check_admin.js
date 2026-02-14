const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const count = await prisma.admin.count();
        console.log('Admin count:', count);
        if (count > 0) {
            const admin = await prisma.admin.findFirst();
            console.log('Admin exists:', admin.username);
        } else {
            console.log('No admin found!');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
