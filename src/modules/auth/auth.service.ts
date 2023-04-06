import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../share/prisma.service';
import { UserRegisterInput } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';
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
    if (!user) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }
    delete user['password'];
    return {
      ...user,
      accessToken: this.generateToken(user.id),
    };
  }
  async register(input: UserRegisterInput) {
    return this.userService.createUser(input);
  }

  generateToken(userId: number) {
    const token = this.jwtService.sign(
      {
        id: userId,
      },
      {
        expiresIn: '2d',
      },
    );
    return token;
  }
}
