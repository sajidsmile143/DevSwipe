const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.swipe.deleteMany({});
  await prisma.match.deleteMany({});
  console.log("All swipes and matches deleted for testing.");
}
run().finally(() => prisma.$disconnect());
