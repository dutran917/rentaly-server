import { IsNotEmpty } from 'class-validator';

export class UpdateApartmentDto {
  @IsNotEmpty()
  apartmentId: number;
  title: string;
  subtitle: string;
  content: string;
  image: string[];
  tags: number[];
}

export class UpdateRoomDto {
  @IsNotEmpty()
  roomId: number;
  title: string;
  price: number;
  maximum: number;
  living_room: number;
  bed_room: number;
  floor: number;
  tags: number[];
  area: number;
}
