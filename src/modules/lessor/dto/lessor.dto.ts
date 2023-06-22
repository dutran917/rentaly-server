import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

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

export class ListApointmentInput {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  time_start: string;
  @IsOptional()
  time_end: string;
  @IsOptional()
  apartmentId: number;
}
