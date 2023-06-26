import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}
  async getStatisticApartment(apartmentId: number) {
    const total = await this.prisma.roomRenter.count({
      where: {
        room: {
          apartmentId: +apartmentId,
        },
      },
    });
    const data = await this.prisma.roomRenter.findMany({
      where: {
        room: {
          apartmentId: +apartmentId,
        },
      },
      include: {
        room: true,
      },
    });
    //  const totalIncome = await this.prisma.roomRenter.groupBy({
    // 	by: ['']
    //  })
    return { data, total };
  }
}
