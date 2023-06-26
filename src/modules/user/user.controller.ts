import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRegisterInput } from './dto/user.dto';
import { UserService } from './user.service';
import { Auth, CurrentUser } from 'src/decorator/auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/info-user')
  @Auth('user')
  async getInfoUser(@CurrentUser('id') userId) {
    return await this.userService.getInfoUser(userId);
  }
  @Auth('user')
  @Get('/history-rent')
  async getHistoryRent(@CurrentUser('id') userId: number) {
    return await this.userService.getHistoryRent(+userId);
  }

  @Auth('user')
  @Get('/apointment-history')
  async getApointment(@CurrentUser('id') userId: number) {
    return this.userService.getApointment(+userId);
  }
  // @Post('/create-post')
}
