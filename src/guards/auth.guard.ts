import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../modules/auth/constants';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!!err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
