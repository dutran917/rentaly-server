import { Injectable } from '@nestjs/common';
import { PrismaService } from '../share/prisma.service';
import { UserRegisterInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async userRegister(UserRegisterInput: UserRegisterInput) {
    console.log('register', UserRegisterInput);
  }
}
