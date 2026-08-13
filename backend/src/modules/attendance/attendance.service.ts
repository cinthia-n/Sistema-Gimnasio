import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CheckinDto } from './dto/checkin.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkin(dto: CheckinDto) {
    const membership =
      await this.prisma.clientService.findUnique({
        where: {
          membershipCode: dto.membershipCode,
        },

        include: {
          client: true,
          service: true,
          promotion: true,
        },
      });

    if (!membership) {
      throw new Error(
        'Código no encontrado',
      );
    }

    const now = new Date();

if (membership.endDate < now) {
  throw new Error(
    'Membresía vencida',
  );
}

if (membership.status !== 'ACTIVE') {
  throw new Error(
    'Membresía inactiva',
  );
}

if (membership.service?.name === 'Dia por medio') {
  const now = new Date();

  const startOfWeek = new Date(now);

  startOfWeek.setDate(
    now.getDate() - now.getDay(),
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0,
  );

  const endOfWeek = new Date(
    startOfWeek,
  );

  endOfWeek.setDate(
    endOfWeek.getDate() + 7,
  );

  const attendances =
    await this.prisma.attendance.count({
      where: {
        clientServiceId: membership.id,

        attendanceDate: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
    });

  if (attendances >= 3) {
    throw new Error(
      'Límite semanal alcanzado para el plan Día por medio',
    );
  }
}

const today = new Date();

today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);

tomorrow.setDate(
  tomorrow.getDate() + 1,
);

const attendanceToday =
  await this.prisma.attendance.findFirst({
    where: {
      clientServiceId: membership.id,

      attendanceDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

if (attendanceToday) {
  throw new Error(
    'El cliente ya registró asistencia hoy',
  );
}
    const attendance =
        
      await this.prisma.attendance.create({
        data: {
          clientServiceId: membership.id,
        },
      });

    return {
      success: true,
      client: membership.client.fullName,
      service:
        membership.service?.name ??
        membership.promotion?.name ??
        'Promoción',
      attendanceDate:
        attendance.attendanceDate,
    };
  }
  async history(membershipCode: string) {
  const membership =
    await this.prisma.clientService.findUnique({
      where: {
        membershipCode,
      },
    });

  if (!membership) {
    throw new Error(
      'Código no encontrado',
    );
  }

  return this.prisma.attendance.findMany({
    where: {
      clientServiceId: membership.id,
    },

    orderBy: {
      attendanceDate: 'desc',
    },
  });
}

async today() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  return this.prisma.attendance.findMany({
    where: {
      attendanceDate: {
        gte: today,
        lt: tomorrow,
      },
    },

    include: {
      clientService: {
        include: {
          client: true,
          service: true,
          promotion: true,
        },
      },
    },
  });
}

async todayCount() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  return this.prisma.attendance.count({
    where: {
      attendanceDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
}
}
