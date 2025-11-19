const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Seed script is now handled per-user in lib/session.js
  // This script is kept for manual database initialization if needed
  
  console.log("✅ Seed script complete.");
  console.log("📝 Note: Demo worlds are now created per-user on first visit via lib/session.js");
  console.log("🔒 Each user gets their own isolated demo world automatically.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
