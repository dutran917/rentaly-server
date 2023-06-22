import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApartmentDto, CreateRoomDto } from './dto/create-post.dto';
import { PrismaService } from '../share/prisma.service';
import { GetListApartmentDto, GetRoomListDto } from './dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from './dto/update-post.dto';
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async createApartment(input: CreateApartmentDto, id: number) {
    // console.log(input, 'input', id);

    const {
      image,
      content,
      title,
      lat,
      long,
      district,
      province,
      tags,
      subtitle,
      address,
    } = input;
    try {
      delete input.image;

      const post = await this.prisma.apartment.create({
        data: {
          ownerId: +id,
          address,
          subtitle,
          title,
          content,
          lat,
          long,
          district,
          province,
        },
      });

      const tagsInApartment = tags.map((tag) => ({
        apartmentId: post.id,
        apartmentTagId: tag,
      }));

      await this.prisma.tagsInApartment.createMany({
        data: tagsInApartment,
      });

      const images = image.map((item) => ({
        url: item,
        apartmentId: post.id,
      }));

      await this.prisma.image.createMany({
        data: images,
      });

      return {
        id: post.id,
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }

  async createRoom(input: CreateRoomDto) {
    const {
      apartmentId,
      title,
      price,
      maximum,
      living_room,
      bed_room,
      tags,
      area,
    } = input;
    try {
      const createRoom = await this.prisma.room.create({
        data: {
          apartmentId,
          title,
          price,
          maximum,
          living_room,
          bed_room,
          floor: title.charAt(0),
          area,
        },
      });
      const tagsInRoom = tags.map((item) => ({
        roomId: createRoom.id,
        roomTagId: item,
      }));

      await this.prisma.tagsInRoom.createMany({
        data: tagsInRoom,
      });
      return {
        id: createRoom.id,
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }

  async getListApartment(input: GetListApartmentDto, ownerId: number) {
    const whereOption = {};
    if (!!input.search) {
      // console.log(input.search);

      whereOption['title'] = {
        contains: input.search,
        mode: 'insensitive',
      };
    }
    // console.log(whereOption);

    const count = await this.prisma.apartment.count({
      where: {
        ownerId: ownerId,
        ...whereOption,
      },
    });
    const data = await this.prisma.apartment.findMany({
      where: {
        ownerId: ownerId,
        ...whereOption,
      },
      include: {
        rooms: true,
      },
      take: +input.page_size,
      skip: +(input.page_size * input.page_index),
    });

    return {
      total: count,
      data,
    };
  }

  async getDetailApartment(apartmentId: number, ownerId?: number) {
    try {
      const apartment = await this.prisma.apartment.findUnique({
        where: {
          id: +apartmentId,
        },
        include: {
          TagsInApartment: true,
          image: true,
          rooms: true,
        },
      });
      if (!apartment) {
        throw new BadRequestException('NOT_FOUND');
      }
      if (ownerId && apartment.ownerId !== ownerId) {
        throw new BadRequestException('INVALID_OWNER');
      }

      return {
        data: apartment,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoomsInApartment(apartmentId: number, input: GetRoomListDto) {
    const whereOption = {};
    if (!!input.search) {
      whereOption['title'] = input.search;
    }
    const total = await this.prisma.room.count({
      where: {
        apartmentId: +apartmentId,
        ...whereOption,
      },
    });
    const data = await this.prisma.room.findMany({
      where: {
        apartmentId: +apartmentId,
        ...whereOption,
      },
      skip: +input.page_index * +input.page_size,
      take: +input.page_size,
      include: {
        TagsInRoom: true,
      },
    });
    return {
      data,
      total,
    };
  }

  async updateApartment(input: UpdateApartmentDto) {
    // const apartment = this.prisma.apartment.findUnique({
    //   where: {
    //     id: input.apartmentId
    //   }
    // })
    try {
      const {
        title,
        subtitle,
        content,
        image,
        tags,
        district,
        lat,
        long,
        address,
      } = input;
      await this.prisma.apartment.update({
        where: {
          id: input.apartmentId,
        },
        data: {
          title,
          subtitle,
          content,
          district,
          lat,
          long,
          address,
        },
      });
      if (!!image?.length) {
        const images = image.map((item) => ({
          url: item,
          apartmentId: input.apartmentId,
        }));

        await this.prisma.image.deleteMany({
          where: {
            apartmentId: input.apartmentId,
          },
        });

        await this.prisma.image.createMany({
          data: images,
        });
      }
      if (!!tags?.length) {
        const tagsInApartment = tags.map((tag) => ({
          apartmentTagId: tag,
          apartmentId: input.apartmentId,
        }));
        await this.prisma.tagsInApartment.deleteMany({
          where: {
            apartmentId: input.apartmentId,
          },
        });

        await this.prisma.tagsInApartment.createMany({
          data: tagsInApartment,
        });
      }
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(input: UpdateRoomDto) {
    const { title, price, maximum, living_room, bed_room, tags, area } = input;
    try {
      const room = await this.prisma.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          title,
          price,
          maximum,
          living_room,
          bed_room,
          floor: title.charAt(0),
          area,
        },
      });
      if (!!tags?.length) {
        const tagsInRoom = tags.map((tag) => ({
          roomTagId: tag,
          roomId: input.roomId,
        }));
        await this.prisma.tagsInRoom.deleteMany({
          where: {
            roomId: input.roomId,
          },
        });

        await this.prisma.tagsInRoom.createMany({
          data: tagsInRoom,
        });
      }
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllApartment(ownerId: number) {
    const data = await this.prisma.apartment.findMany({
      where: {
        ownerId: ownerId,
      },
    });
    return data;
  }

  async getApartmentTag() {
    return await this.prisma.apartmentTag.findMany({});
  }
  async getRoomTag() {
    return await this.prisma.roomTag.findMany({});
  }
}
