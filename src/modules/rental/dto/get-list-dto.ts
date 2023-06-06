export class GetListRentalDto {
  page_size: number;
  page_index: number;
  search: string;
  district: string;
  price: number[];
  bed_room: number;
  living_room: number;
}
export class GetListRoomDto {
  apartmentId: number;
  bed_room: number;
  living_room: number;
}
