import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterInput } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/register')
  async userRegister(@Body() input: UserRegisterInput) {
    return await this.userService.userRegister(input);
  }
}
