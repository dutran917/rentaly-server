import { IsNotEmpty } from 'class-validator';

export class UserRegisterInput {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  phone: string;
  full_name: string;
}

export class UserLoginInput {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
