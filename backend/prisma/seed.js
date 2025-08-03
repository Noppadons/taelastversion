const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'noppadon08225@gmail.com';
  const adminUsername = 'admin';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // ใช้ upsert เพื่อสร้างหรืออัปเดต user 'admin'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { // ถ้ามี email นี้อยู่แล้ว ให้อัปเดตข้อมูลอื่น (ถ้าต้องการ)
        username: adminUsername,
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
    },
    create: { // ถ้ายังไม่มี email นี้ ให้สร้างใหม่
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  console.log({ admin });
  console.log(`Successfully created or updated admin user: '${adminUsername}'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });