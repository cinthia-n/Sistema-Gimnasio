import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  console.log("Ejecutando seed...");

  //--------------------------------------------------
  // Usuario ADMIN (dueño)
  //--------------------------------------------------

  const adminExists = await prisma.user.findUnique({
    where: { username: 'eduin' },
  });

  if (!adminExists) {

    const hashedPassword = await bcrypt.hash('CambiarAhora123*', 10);

    await prisma.user.create({
      data: {
        username: 'eduin',
        fullName: 'Eduin',
        password: hashedPassword,
        role: UserRole.ADMIN,
        mustChangePassword: true,
      },
    });

    console.log('Administrador (Eduin) creado');

  } else {
    console.log('Administrador ya existe');
  }

  //--------------------------------------------------
  // Cuentas de empleadas (en blanco, se personalizan
  // al primer inicio de sesión)
  //--------------------------------------------------

  const employeeUsernames = ['recepcion1', 'recepcion2'];

  for (const username of employeeUsernames) {

    const exists = await prisma.user.findUnique({
      where: { username },
    });

    if (!exists) {

      const hashedPassword = await bcrypt.hash('CambiarAhora123*', 10);

      await prisma.user.create({
        data: {
          username,
          fullName: 'Nueva empleada',
          password: hashedPassword,
          role: UserRole.EMPLOYEE,
          mustChangePassword: true,
        },
      });

      console.log(`Cuenta ${username} creada`);
    }
  }

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });