import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../share/prisma.service';
import { UserRegisterInput } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async signIn(username, pass) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });
  }
  async register(input: UserRegisterInput) {
    return this.userService.createUser(input);
  }
}
