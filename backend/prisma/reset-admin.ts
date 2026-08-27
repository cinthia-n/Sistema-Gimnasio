import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'Admin123*';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: {
      username: 'admin',
    },
    data: {
      password: passwordHash,
      passwordChangedAt: null,
      mustChangePassword: false,
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });

  console.log('Administrador actualizado:');
  console.log(user);
  console.log('Contraseña actual: Admin123*');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });