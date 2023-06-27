import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class StatsDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  apartmentId: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Type(() => Number)
  year?: number;
}
