const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({
    select: { name: true, role: true, goal: true, onboarded: true, id: true }
  });
  console.log(JSON.stringify(users, null, 2));
}
run().finally(() => prisma.$disconnect());
