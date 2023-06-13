import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginInput, UserRegisterInput } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register-user')
  register(@Body() input: UserRegisterInput) {
    return this.userService.createUser(input);
  }

  @Post('/lessor-login')
  loginLessor(@Body() input: UserLoginInput) {
    return this.authService.loginLessor(input);
  }
  @Post('/user-login')
  loginUser(@Body() input: UserLoginInput) {
    return this.authService.loginUser(input);
  }
  @Post('/admin-login')
  loginAdmin(@Body() input: UserLoginInput) {
    return this.authService.loginAdmin(input);
  }
}
