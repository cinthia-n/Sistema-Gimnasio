import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.service.updateMany({
    where: { name: 'Mensual' },
    data: { code: 'MONTHLY' },
  });

  await prisma.service.updateMany({
    where: { name: 'Grupal' },
    data: { code: 'GROUP' },
  });

  await prisma.service.updateMany({
    where: { name: 'Día por medio' },
    data: { code: 'ALTERNATE' },
  });

  await prisma.service.updateMany({
    where: { name: 'Diario' },
    data: { code: 'SESSION' },
  });

  await prisma.service.updateMany({
    where: { name: 'Anual' },
    data: { code: 'YEARLY' },
  });

  await prisma.service.updateMany({
    where: { name: 'Cambio corporal 3 meses' },
    data: { code: 'THREE_MONTHS' },
  });

  await prisma.service.updateMany({
    where: { name: 'Asesoría nutricional' },
    data: { code: 'NUTRITION' },
  });

  await prisma.service.updateMany({
    where: { name: 'Asesoría personalizada' },
    data: { code: 'PERSONAL' },
  });

  console.log('Servicios actualizados');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });