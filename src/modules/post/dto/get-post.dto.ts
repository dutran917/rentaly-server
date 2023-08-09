import { IsNotEmpty, IsOptional } from 'class-validator';
export enum RoomStatus {
  RENTED = 'RENTED',
  FREE = 'FREE',
}
export class GetListApartmentDto {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  search: string;
}

export class GetRoomListDto {
  @IsNotEmpty()
  page_size: number;
  @IsNotEmpty()
  page_index: number;
  @IsOptional()
  search: string;
  @IsOptional()
  status: RoomStatus;
}
