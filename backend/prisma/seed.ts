import { PrismaClient, UserRole, ServiceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  console.log("Entro al seed");
  const adminExists = await prisma.user.findUnique({
    where: {
      username: 'admin',
    },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123*', 10);

    await prisma.user.create({
      data: {
        username: 'admin',
        fullName: 'Propietario',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log('Administrador creado');
  } else {
    console.log('Administrador ya existe');
  }

  const employeeExists = await prisma.user.findUnique({
    where: {
      username: 'vendedora1',
    },
  });

  if (!employeeExists) {
    const hashedPassword = await bcrypt.hash(
      'Vendedora123*',
      10,
    );

  await prisma.user.create({
    data: {
      username: 'vendedora1',
      fullName: 'Vendedora 1',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
  });

  console.log('Vendedora creada');
} else {
  console.log('Vendedora ya existe');
}

const services = [

  {
    code: 'MONTHLY',
    name: 'Mensual',
    type: ServiceType.MEMBERSHIP,
    durationDays: 30,
    basePrice: 100,
  },

  {
    code: 'GROUP',
    name: 'Grupal',
    type: ServiceType.MEMBERSHIP,
    durationDays: 30,
    basePrice: 90,
  },

  {
    code: 'ALTERNATE',
    name: 'Día por medio',
    type: ServiceType.MEMBERSHIP,
    durationDays: 30,
    basePrice: 80,
  },

  {
    code: 'SESSION',
    name: 'Diario',
    type: ServiceType.MEMBERSHIP,
    durationDays: 1,
    basePrice: 10,
  },

  {
    code: 'THREE_MONTHS',
    name: 'Cambio corporal 3 meses',
    type: ServiceType.PROGRAM,
    durationDays: 90,
    basePrice: 350,
  },

  {
    code: 'NUTRITION',
    name: 'Asesoría nutricional',
    type: ServiceType.ADDITIONAL,
    durationDays: 30,
    basePrice: 50,
  },

  {
    code: 'PERSONAL',
    name: 'Asesoría personalizada',
    type: ServiceType.ADDITIONAL,
    durationDays: 30,
    basePrice: 50,
  },

];

for (const service of services) {

  const exists = await prisma.service.findUnique({

    where: {

      code: service.code,

    },

  });

  if (!exists) {

    await prisma.service.create({

      data: service,

    });

    console.log(`${service.name} creado`);

  }

}
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
