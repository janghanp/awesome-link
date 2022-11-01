import { PrismaClient } from "@prisma/client";
import { links } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "janghan0412@gmail.com",
      name: "janghan",
      role: "ADMIN",
    },
  });

  await prisma.link.createMany({
    data: links,
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
