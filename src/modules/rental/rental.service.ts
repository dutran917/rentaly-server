import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { GetListRentalDto, GetListRoomDto } from './dto/get-list-dto';
import { CreateApointmentInput } from './dto/create-apointment.dto';

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
      whereOption['district'] = input.district;
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
    const total = await this.prisma.apartment.count({
      where: whereOption,
    });
    const data = await this.prisma.apartment.findMany({
      where: {
        verified: 'ACCEPT',
        ...whereOption,
      },
      take: +input.page_size,
      skip: +input.page_index * +input.page_size,
      include: {
        rooms: true,
        image: true,
      },
    });

    return {
      data,
      total,
    };
  }

  async userGetDetailApartment(id: number) {
    const data = this.prisma.apartment.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        rooms: true,
        TagsInApartment: {
          include: {
            tag: true,
          },
        },
      },
    });
    return data;
  }

  async userGetListRoomInApartment(input: GetListRoomDto) {
    const rooms = await this.prisma.room.findMany({
      where: {
        apartmentId: +input.apartmentId,
        bed_room: +input.bed_room,
        living_room: +input.living_room,
      },
      include: {
        TagsInRoom: true,
      },
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
}
