import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    if (data) {
      return user[data];
    }
    return user;
  },
);
