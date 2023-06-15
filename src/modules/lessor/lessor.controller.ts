import { Body, Controller, Get, Post } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorRegisterInput } from './dto/lessor.dto';
import { Auth, CurrentUser } from 'src/decorator/auth';
import { UserService } from '../user/user.service';

@Controller('lessor')
export class LessorController {
  constructor(
    private readonly lessorService: LessorService,
    private readonly userService: UserService,
  ) {}

  @Post('/register-lessor')
  registerLessor(@Body() input: LessorRegisterInput) {
    return this.lessorService.registerLessor(input);
  }

  @Get('/info-manager')
  @Auth('lessor')
  async getInfoLessor(@CurrentUser('id') userId) {
    console.log(userId);

    return await this.userService.getInfoUser(userId);
  }
}
