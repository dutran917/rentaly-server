import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListUserInput {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  search: string;
}
