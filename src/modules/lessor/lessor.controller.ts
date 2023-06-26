import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorRegisterInput, ListApointmentInput } from './dto/lessor.dto';
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
  async getInfoLessor(@CurrentUser('id') userId: number) {
    console.log(userId);

    return await this.userService.getInfoUser(userId);
  }

  @Get('/list-apointment')
  @Auth('lessor')
  async getListApointment(
    @CurrentUser('id') userId: number,
    @Query() input: ListApointmentInput,
  ) {
    return await this.lessorService.getListApointment(+userId, input);
  }

  @Auth('lessor')
  @Post('/handle-apointment')
  async handleApointment(@Body() input: { status: boolean; id: number }) {
    return await this.lessorService.handleApointment(input);
  }
}
