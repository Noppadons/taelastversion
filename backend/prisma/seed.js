// backend/prisma/seed.js
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
    },
    create: {
      username: username,
      password: hashedPassword,
      role: Role.ADMIN, // <-- กำหนด role ให้เป็น ADMIN
    },
  });

  console.log({ admin });
  console.log(`Successfully created or updated admin user: '${username}'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });