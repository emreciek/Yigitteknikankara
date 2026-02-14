const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if admin exists
        const admin = await prisma.admin.findUnique({
            where: { username: 'admin' },
        });

        if (admin) {
            console.log('Admin user found. Updating password...');
            await prisma.admin.update({
                where: { username: 'admin' },
                data: { password: hashedPassword },
            });
            console.log('Admin password updated to: password123');
        } else {
            console.log('Creating new admin user...');
            await prisma.admin.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                },
            });
            console.log('Admin created: admin / password123');
        }
    } catch (e) {
        console.error('Error seeding admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
