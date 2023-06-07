import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class LessorRegisterInput {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  password: string;
}
