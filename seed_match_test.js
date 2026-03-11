const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const sajidId = "cmmkzvrty0000vatk0f27hk0o";
  const rahulId = "cmmkyyj540002vaisnifkn1ci";
  
  await prisma.swipe.upsert({
    where: { swiperId_swipedId: { swiperId: rahulId, swipedId: sajidId } },
    update: { type: "LIKE" },
    create: {
      swiperId: rahulId,
      swipedId: sajidId,
      type: "LIKE"
    }
  });
  console.log("Rahul (Backend) has liked Sajid (Frontend). Now if Sajid likes Rahul, it will be a MATCH!");
}
run().finally(() => prisma.$disconnect());
