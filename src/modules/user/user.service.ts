import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { UserLoginInput, UserRegisterInput } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(input: UserRegisterInput) {
    try {
      const hashPash = await bcrypt.hash(input.password, 10);
      await this.prisma.user.create({
        data: {
          ...input,
          password: hashPash,
          role: 'user',
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
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
