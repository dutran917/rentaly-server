import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { UserLoginInput, UserRegisterInput } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(input: UserRegisterInput) {
    try {
      console.log(input);

      const hashPash = await bcrypt.hash(input.password, 10);
      console.log(hashPash);

      await this.prisma.user.create({
        data: {
          ...input,
          password: hashPash,
          role: input.role,
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('CANNOT_CREATE');
    }
  }

  async getInfoUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async userCreatePost(input: UserLoginInput) {}
}
