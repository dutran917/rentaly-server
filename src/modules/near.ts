import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from '../share/prisma.service';
import { StatsDto } from './dto/stats.dto';
interface Stats {
  all: number[];
  rooms: { room_id: number; title: string; stats: number[] }[];
}
@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}
  async getStats(statsDto: StatsDto) {
    const { apartmentId, year } = statsDto;
    const searchYear = year || moment().year();
    const allRecords = await this.prisma.roomRenter.findMany({
      where: {
        end_at: {
          gt: moment(`${searchYear}0101`, 'YYYYMMDD').startOf('date').toDate(),
        },
        start_at: {
          lt: moment(`${searchYear + 1}0101`, 'YYYYMMDD')
            .startOf('date')
            .toDate(),
        },
        room: {
          apartmentId,
        },
      },
      select: {
        start_at: true,
        end_at: true,
        price: true,
        room: {
          select: { title: true },
        },
      },
    });
    const result: Stats = {
      all: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rooms: [],
    };
    const stats = allRecords.reduce((pre: Stats, cur: any) => {
      const startMonth = moment(cur.start_at).month();
      const endMonth = moment(cur.end_at).month();
      const numsMonth = endMonth - startMonth;
      const priceEachMonth = cur.price / numsMonth;
      for (let i = startMonth; i < endMonth; i++) {
        pre.all[i] = pre.all[i] + priceEachMonth;
        const index = pre.rooms.findIndex(
          (item) => item.room_id === cur.room.id,
        );
        if (index >= 0) {
          pre.rooms[index].stats[i] = pre.all[i] + priceEachMonth;
        } else {
          pre.rooms.push({
            room_id: cur.room.id,
            title: cur.room.title,
            stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          });
          pre.rooms[pre.rooms.length - 1].stats[i] = priceEachMonth;
        }
      }
    }, result);
    return stats;
  }
}
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class StatsDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  apartmentId: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Type(() => Number)
  year?: number;
}
