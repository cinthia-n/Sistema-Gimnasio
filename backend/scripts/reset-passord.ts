import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const username = process.argv[2];

  if (!username) {
    console.error('Uso: npm run reset-password -- <username>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    console.error(`Usuario '${username}' no encontrado`);
    process.exit(1);
  }

  const tempPassword = 'Temporal' + Math.floor(1000 + Math.random() * 9000) + '*';
  const hashed = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { username },
    data: {
      password: hashed,
      mustChangePassword: true,
    },
  });

  console.log(`Contraseña temporal para '${username}': ${tempPassword}`);
  console.log('El usuario deberá cambiarla al iniciar sesión.');

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());