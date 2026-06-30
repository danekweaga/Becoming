import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedDemoData } from "../lib/seed-demo";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connectionString = process.env.DATABASE_URL.replace(
  /[?&]sslmode=[^&]*/g,
  "",
).replace(/\?$/, "");

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await seedDemoData(prisma);

  console.log("Seed complete:");
  console.log(`- User: ${result.userName} (${result.userEmail})`);
  console.log(`- Vision: ${result.visionYear} ${result.visionTheme}`);
  console.log(`- Season: ${result.seasonName}`);
  console.log(`- Habits: ${result.habitCount}`);
  console.log(`- Daily check-ins: ${result.checkinCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
