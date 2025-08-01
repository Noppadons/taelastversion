// backend/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const plainPassword = 'password123';

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // ใช้ upsert เพื่อสร้างหรืออัปเดต user 'admin'
  // ทำให้สามารถรัน script นี้ซ้ำได้โดยไม่ error
  const admin = await prisma.admin.upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
    },
    create: {
      username: username,
      password: hashedPassword,
    },
  });

  console.log({ admin });
  console.log(`Successfully created or updated admin user: '${username}' with password 'password123'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });