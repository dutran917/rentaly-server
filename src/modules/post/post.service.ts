import { Injectable } from '@nestjs/common';
import { CreateApartmentDto, CreateRoomDto } from './dto/create-post.dto';
import { PrismaService } from '../share/prisma.service';
import { GetListApartmentDto } from './dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from './dto/update-post.dto';
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async createApartment(input: CreateApartmentDto, id: number) {
    try {
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

      delete input.image;

      const post = await this.prisma.apartment.create({
        data: {
          ownerId: id,
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
      floor,
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
          floor,
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
      whereOption['title'] = {
        contains: input.search,
        mode: 'insensitive',
      };
    }
    const count = await this.prisma.apartment.count({
      where: {
        ownerId: ownerId,
        ...whereOption,
      },
    });
    const data = await this.prisma.apartment.findMany({
      where: {
        ownerId: ownerId,
      },
      take: +input.page_size,
      skip: +(input.page_size * input.page_index),
      include: {
        TagsInApartment: true,
        image: true,
      },
    });

    return {
      total: count,
      data,
    };
  }

  async getRoomsInApartment(apartmentId: number) {
    const data = await this.prisma.room.findMany({
      where: {
        apartmentId: +apartmentId,
      },
      include: {
        TagsInRoom: true,
      },
    });
    return {
      data,
    };
  }

  async updateApartment(input: UpdateApartmentDto) {
    // const apartment = this.prisma.apartment.findUnique({
    //   where: {
    //     id: input.apartmentId
    //   }
    // })
    try {
      const { title, subtitle, content, image, tags } = input;
      await this.prisma.apartment.update({
        where: {
          id: input.apartmentId,
        },
        data: {
          title,
          subtitle,
          content,
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
    const { title, price, maximum, living_room, bed_room, floor, tags, area } =
      input;
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
          floor,
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

  async getApartmentTag() {
    return await this.prisma.apartmentTag.findMany({});
  }
  async getRoomTag() {
    return await this.prisma.roomTag.findMany({});
  }
}
