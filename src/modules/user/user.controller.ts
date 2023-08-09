import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRegisterInput } from './dto/user.dto';
import { UserService } from './user.service';
import { Auth, CurrentUser } from 'src/decorator/auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/info-user')
  @Auth('user')
  async getInfoUser(@CurrentUser('id') userId: number) {
    return await this.userService.getInfoUser(userId);
  }

  @Post('/update-info')
  @Auth('user')
  async userUpdateProfile(
    @CurrentUser('id') userId: number,
    @Body() input: { full_name?: string; phone?: string },
  ) {
    return await this.userService.userUpdateProfile(userId, input);
  }

  @Post('/update-password')
  @Auth('user')
  async userUpdatePassword(
    @CurrentUser('id') userId: number,
    @Body() input: { old_password?: string; new_password?: string },
  ) {
    return await this.userService.userUpdatePassword(userId, input);
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
