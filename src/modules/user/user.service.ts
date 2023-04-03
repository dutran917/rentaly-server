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
        },
      });
      return {
        message: 'SUCCESS',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // async userLogin(input: UserLoginInput) {

  // }
}
