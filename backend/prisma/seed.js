import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@fittrack.app' },
    update: {},
    create: {
      email: 'demo@fittrack.app',
      name: 'Demo User',
    },
  });
  console.log('Seeded user:', user.email, '(id:', user.id, ')');
  console.log('Set USER_ID=' + user.id + ' in .env to use this user.');

  const existing = await prisma.nutritionGoal.findFirst({ where: { userId: user.id } });
  if (!existing) {
    await prisma.nutritionGoal.create({
      data: { userId: user.id, dailyCalories: 2000, dailyProtein: 150 },
    });
    console.log('Seeded default nutrition goal.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
