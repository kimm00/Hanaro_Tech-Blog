// prisma/seed.ts
import { seedPrisma as prisma } from './seed-client';

async function main() {
  console.log('🌱 Seeding start...');

  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: '관리자',
      passwd: 'admin',
      isadmin: true,
    },
  });

  console.log('✅ Seeding finished!');
}

main().finally(async () => {
  await prisma.$disconnect();
});
