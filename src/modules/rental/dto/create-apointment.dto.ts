import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApointmentInput {
  @IsNotEmpty()
  roomId: number;
  @IsNotEmpty()
  fullName: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  date: string;
  @IsOptional()
  note: string;
  @IsNotEmpty()
  apartmentId: number;
}
