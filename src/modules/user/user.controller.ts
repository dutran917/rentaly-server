import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRegisterInput } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/decorator/auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/info-user')
  @UseGuards(AuthGuard)
  async getInfoUser(@CurrentUser('id') userId) {
    return await this.userService.getInfoUser(userId);
  }
  // @Post('/create-post')
}
