import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../share/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(input: CreatePostDto, id: number) {
    try {
      const { image, content, title, price, area, living_room, bed_room } =
        input;

      delete input.image;

      const post = await this.prisma.post.create({
        data: {
          authorId: id,
          title,
          content,
          price,
          area,
          living_room,
          bed_room,
        },
      });

      const images = image.map((item) => ({
        url: item,
        postId: post.id,
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
