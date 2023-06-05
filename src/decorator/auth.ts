import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { role } from '@prisma/client';
import { UserGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    if (data) {
      return user[data];
    }
    return user;
  },
);

export const Auth = (...apis: role[]) => {
  return applyDecorators(
    SetMetadata('roles', apis),
    UseGuards(UserGuard, RoleGuard),
  );
};
