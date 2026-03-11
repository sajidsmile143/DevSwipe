const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Latest Messages in Database:");
  console.log(JSON.stringify(messages, null, 2));
}
run().finally(() => prisma.$disconnect());
