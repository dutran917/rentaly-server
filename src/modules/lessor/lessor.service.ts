import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { LessorRegisterInput } from './dto/lessor.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LessorService {
  constructor(private readonly prisma: PrismaService) {}
  async registerLessor(input: LessorRegisterInput) {
    const { email, password, phone, fullname } = input;
    try {
      const hashPash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          email,
          phone,
          full_name: fullname,
          password: hashPash,
          role: 'lessor',
        },
      });
      return {
        message: 'REGISTER SUCCESS',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
