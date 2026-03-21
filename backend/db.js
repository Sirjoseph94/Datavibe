const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({});

async function setupDb() {
  // Default super admin
  const superExists = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!superExists) {
    const hash = await bcrypt.hash('super123', 10);
    await prisma.user.create({
      data: {
        username: 'superadmin',
        password_hash: hash,
        role: 'SUPER_ADMIN'
      }
    });
  }

  // Default admin
  const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password_hash: hash,
        role: 'ADMIN'
      }
    });
  }
}

module.exports = { prisma, Prisma, setupDb };
