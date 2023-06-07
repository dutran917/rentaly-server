import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/modules/share/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ iat, exp, id, type }: any): Promise<User> {
    const timeDiff: number = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user.status) throw new UnauthorizedException();
    return user;
  }
}
