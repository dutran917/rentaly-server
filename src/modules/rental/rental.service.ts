import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { GetListRentalDto, GetListRoomDto } from './dto/get-list-dto';
import { CreateApointmentInput } from './dto/create-apointment.dto';
import { calculateDistance } from 'src/utils/common';
import * as ListUniversity from '../../utils/University.json';
import * as moment from 'moment';
@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async userGetListApartment(input: GetListRentalDto) {
    const whereOption = {};
    if (!!input.search) {
      whereOption['address'] = {
        mode: 'insensitive',
        contains: input.search,
      };
    }
    if (!!input.district) {
      whereOption['district'] = {
        mode: 'insensitive',
        contains: input.district,
      };
    }
    if (!!input.price) {
      whereOption['rooms'] = {
        some: {
          price: {
            lte: +input.price[1],
            gte: +input.price[0],
          },
        },
      };
    }
    if (!!input.bed_room && !!input.living_room) {
      whereOption['rooms'] = {
        some: {
          living_room: +input.living_room,
          bed_room: +input.bed_room,
        },
      };
    }

    let total = await this.prisma.apartment.count({
      where: {
        verified: 'ACCEPT',
        published: true,
        ...whereOption,
      },
    });
    let data = await this.prisma.apartment.findMany({
      where: {
        verified: 'ACCEPT',
        published: true,
        ...whereOption,
      },
      take: +input.page_size,
      skip: +input.page_index * +input.page_size,
      include: {
        rooms: true,
        image: true,
      },
    });

    const { lat, long } = {
      lat: +input.lat,
      long: +input.long,
    };
    if (!!lat && !!long) {
      data = data.filter((item) => {
        const distance = calculateDistance(lat, long, item.lat, item.long);
        console.log(distance, 'dis');

        if (distance < 2000) {
          return item;
        }
        return null;
      });
      total = data.length;
    }
    console.log(data);

    return {
      data,
      total,
    };
  }

  async userGetDetailApartment(id: number) {
    const data = await this.prisma.apartment.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        rooms: {
          include: {
            RoomRenter: true,
          },
        },
        TagsInApartment: {
          include: {
            tag: true,
          },
        },
      },
    });
    const currentDate = new Date();
    return {
      ...data,
      rooms: data.rooms.filter((room) => {
        if (room.RoomRenter.length > 0 && room.display) {
          if (
            moment(room.RoomRenter[room.RoomRenter?.length - 1]?.end_at)
              .toDate()
              .getTime() < currentDate.getTime()
          ) {
            return room;
          } else {
            // console.log('hell no');
          }
        } else {
          if (room.display) return room;
        }
      }),
    };
  }

  async userGetListRoomInApartment(input: GetListRoomDto) {
    let rooms = await this.prisma.room.findMany({
      where: {
        apartmentId: +input.apartmentId,
        bed_room: +input.bed_room,
        living_room: +input.living_room,
      },
      include: {
        TagsInRoom: true,
        RoomRenter: true,
      },
    });
    const currentDate = new Date();
    rooms = rooms.filter((room) => {
      if (room.RoomRenter.length > 0) {
        if (
          moment(room.RoomRenter[room.RoomRenter?.length - 1]?.end_at)
            .toDate()
            .getTime() < currentDate.getTime()
        ) {
          return room;
        }
      } else {
        return room;
      }
    });
    return {
      data: rooms,
    };
  }

  async userGetRoomDetail(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: +roomId,
      },
      include: {
        TagsInRoom: {
          include: {
            tag: true,
          },
        },
      },
    });
    return room;
  }

  async createApointment(input: CreateApointmentInput) {
    try {
      await this.prisma.apointment.create({
        data: {
          fullName: input.fullName,
          date: input.date,
          phone: input.phone,
          roomId: +input.roomId,
          note: input.note,
          apartmentId: +input.apartmentId,
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }
  async getListUniversity() {
    try {
      const data = Promise.all(
        ListUniversity.map(async (item) => {
          const listApartment = await this.prisma.apartment.findMany({
            where: {
              verified: 'ACCEPT',
            },
          });
          const result = listApartment.filter((apartment) => {
            const distance = calculateDistance(
              item.lat,
              item.long,
              apartment.lat,
              apartment.long,
            );
            return distance < 2000;
          });

          return {
            ...item,
            count: result.length,
          };
        }),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
