import { VERIFY_STATUS } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ApproveLessorInput {
  @IsNotEmpty()
  lessor_id: number;
  @IsNotEmpty()
  accept: boolean;
  @IsOptional()
  reason: string;
}

export class ListRegisterLessorInput {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  verified: VERIFY_STATUS;
  @IsOptional()
  search: string;
}

export class UpdateLessorInput {
  @IsNotEmpty()
  lessorId: number;
  @IsOptional()
  full_name: string;
  @IsOptional()
  email: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  password: string;
}
export class CreateLessorInput {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  full_name: string;
  @IsNotEmpty()
  password: string;
}
