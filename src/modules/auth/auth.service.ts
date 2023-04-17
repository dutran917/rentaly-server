import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../share/prisma.service';
import { UserLoginInput, UserRegisterInput } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(input: UserLoginInput) {
    const { username, password } = input;
    const user = await this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('WRONG_CREDENTIALS');
    }
    delete user['password'];
    return {
      ...user,
      accessToken: this.generateToken(user.id),
    };
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
