const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const swipes = await prisma.swipe.findMany();
  console.log(JSON.stringify(swipes, null, 2));
}
run().finally(() => prisma.$disconnect());
