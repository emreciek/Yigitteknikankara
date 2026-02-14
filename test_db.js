const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    console.log('Testing DB connection...');
    try {
        const count = await prisma.admin.count();
        console.log('Connection successful! Admin count:', count);
        const admins = await prisma.admin.findMany();
        console.log('Admins:', admins);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
