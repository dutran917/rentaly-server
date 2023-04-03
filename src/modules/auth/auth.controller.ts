import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterInput } from '../user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() input: UserRegisterInput) {
    return this.authService.register(input);
  }
}
