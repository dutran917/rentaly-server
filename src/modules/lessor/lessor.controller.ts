import { Body, Controller, Post } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorRegisterInput } from './dto/lessor.dto';

@Controller('lessor')
export class LessorController {
  constructor(private readonly lessorService: LessorService) {}

  @Post('/register-lessor')
  registerLessor(@Body() input: LessorRegisterInput) {
    return this.lessorService.registerLessor(input);
  }
}
