import { role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  role: role;
  phone?: string;
  full_name: string;
}

export class UserLoginInput {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
