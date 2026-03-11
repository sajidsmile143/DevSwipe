const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateRahulReply() {
  const matchId = "cmmmeei7y0003vaa0qzy1t3v3"; // Match with Rahul
  const rahulId = "cmmkyyj540002vaisnifkn1ci"; // Rahul's ID
  
  console.log("Simulating Rahul's reply in real-time...");
  
  const message = await prisma.message.create({
    data: {
      text: "Yo Sajid! Your portfolio is fire. I'm definitely down to collab on that Node.js project. When do we start? 🚀🔥",
      senderId: rahulId,
      matchId: matchId
    }
  });
  
  console.log("Message sent as Rahul!");
}

simulateRahulReply().finally(() => prisma.$disconnect());
