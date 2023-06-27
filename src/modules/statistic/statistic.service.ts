import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { StatsDto } from './dto/get-statistic.dto';
import * as moment from 'moment';
export interface Stats {
  all: number[];
  rooms: { room_id: number; title: string; stats: number[] }[];
}
@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}
  async getStatisticApartment(statsDto: StatsDto) {
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
          select: { title: true, id: true },
        },
      },
    });
    const result: Stats = {
      all: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rooms: [],
    };
    allRecords.forEach((item) => {
      let startMonth = moment(item.start_at).month();
      let endMonth = moment(item.end_at).month();
      if (moment(item.start_at).year() < searchYear) {
        startMonth = 0;
      }
      if (moment(item.end_at).year() > searchYear) {
        endMonth = 12;
      }
      const numsMonth = moment(item.end_at)
        .startOf('month')
        .diff(moment(item.start_at).startOf('month'), 'month');
      const priceEachMonth = item.price / numsMonth;
      for (let i = startMonth; i < endMonth; i++) {
        const index = result.rooms.findIndex(
          (room) => room.room_id === item.room.id,
        );
        result.all[i] = result.all[i] + priceEachMonth;
        if (index >= 0) {
          result.rooms[index].stats[i] =
            result.rooms[index].stats[i] + priceEachMonth;
        } else {
          result.rooms.push({
            room_id: item.room.id,
            title: item.room.title,
            stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          });
          result.rooms[result.rooms.length - 1].stats[i] = priceEachMonth;
        }
      }
    });
    return result;
  }
}
