const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✅ Default admin created (admin / admin123)');

  // Create default contact info
  const contactExists = await prisma.contactInfo.findFirst();
  if (!contactExists) {
    await prisma.contactInfo.create({
      data: {
        address: 'Örnek Mahallesi, Teknik Servis Caddesi No: 42, İstanbul',
        phone: '+90 (212) 555 0123',
        email: 'info@yigitteknik.com',
        workingHours: 'Pazartesi - Cumartesi: 08:00 - 18:00',
      },
    });
    console.log('✅ Default contact info created');
  }

  // Create default homepage
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Ana Sayfa',
      slug: 'home',
      content: 'Yiğit Teknik - Profesyonel Kombi ve Isıtma Sistemleri Teknik Servisi',
      isVisible: true,
      order: 0,
    },
  });

  // Create hero section for homepage
  await prisma.section.upsert({
    where: { id: 1 },
    update: {},
    create: {
      pageId: homePage.id,
      title: 'Profesyonel Kombi Teknik Servisi',
      content: 'Kombi bakım, onarım ve montaj hizmetlerinde uzman ekibimizle yanınızdayız. 7/24 acil servis hizmeti.',
      type: 'hero',
      order: 0,
    },
  });

  // Create services section
  await prisma.section.upsert({
    where: { id: 2 },
    update: {},
    create: {
      pageId: homePage.id,
      title: 'Hizmetlerimiz',
      content: JSON.stringify([
        { title: 'Kombi Bakımı', description: 'Periyodik kombi bakım hizmetleri ile cihazınızın ömrünü uzatın.' },
        { title: 'Kombi Tamiri', description: 'Her marka ve model kombi tamiri konusunda uzman ekibimiz.' },
        { title: 'Kombi Montajı', description: 'Profesyonel kombi montaj ve kurulum hizmetleri.' },
        { title: 'Acil Servis', description: '7/24 acil teknik servis hizmeti ile her zaman yanınızdayız.' },
        { title: 'Kalorifer Tesisatı', description: 'Kalorifer tesisatı döşeme, bakım ve onarım hizmetleri.' },
        { title: 'Doğalgaz Tesisatı', description: 'Doğalgaz tesisatı montaj ve kontrol hizmetleri.' },
      ]),
      type: 'services',
      order: 1,
    },
  });

  // Create gallery section
  await prisma.section.upsert({
    where: { id: 3 },
    update: {},
    create: {
      pageId: homePage.id,
      title: 'Çalışmalarımız',
      content: 'Gerçekleştirdiğimiz teknik servis çalışmalarından kareler.',
      type: 'gallery',
      order: 2,
    },
  });

  console.log('✅ Default pages and sections created');

  // Create about page
  await prisma.page.upsert({
    where: { slug: 'hakkimizda' },
    update: {},
    create: {
      title: 'Hakkımızda',
      slug: 'hakkimizda',
      content: 'Yiğit Teknik olarak uzun yıllardır kombi ve ısıtma sistemleri alanında hizmet vermekteyiz.',
      isVisible: true,
      order: 1,
    },
  });

  console.log('✅ About page created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
