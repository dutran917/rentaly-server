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
  @IsNumber()
  page_size: number;
  @IsNotEmpty()
  @IsNumber()
  page_index: number;
  @IsOptional()
  verified: VERIFY_STATUS;
}
