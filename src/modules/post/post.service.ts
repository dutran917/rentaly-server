import { Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-post.dto';
import { PrismaService } from '../share/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async createApartment(input: CreateApartmentDto, id: number) {
    try {
      const { image, content, title, lat, long, district, province, tags } =
        input;

      delete input.image;

      const post = await this.prisma.apartment.create({
        data: {
          ownerId: id,
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
        message: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
