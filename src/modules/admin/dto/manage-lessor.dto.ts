import { IsNotEmpty, IsOptional } from 'class-validator';

export class ApproveLessorInput {
  @IsNotEmpty()
  lessor_id: number;
  @IsNotEmpty()
  accept: boolean;
  @IsOptional()
  reason: string;
}
