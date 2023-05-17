import { IsNotEmpty } from 'class-validator';

export class CreateApartmentDto {
  title: string;
  subtitle: string;
  content: string;
  address: string;
  lat: number;
  long: number;
  district?: string;
  province?: string;
  image: string[];
  tags: number[];
}

export class CreateRoomDto {
  @IsNotEmpty()
  apartmentId: number;
  @IsNotEmpty()
  title: string;
  price: number;
  maximum: number;
  living_room: number;
  bed_room: number;
  floor?: number;
  tags: number[];
  area: number;
}
