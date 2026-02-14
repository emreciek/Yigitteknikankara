const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const images = await prisma.image.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc',
        },
    });

    console.log('Last 5 images:');
    images.forEach(img => {
        console.log(`ID: ${img.id}, Filename: ${img.filename}, CreatedAt: ${img.createdAt}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
