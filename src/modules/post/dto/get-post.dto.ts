import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetListApartmentDto {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  search: string;
}
