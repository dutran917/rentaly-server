export class CreateApartmentDto {
  title: string;
  content: string;
  lat: number;
  long: number;
  district: string;
  province: string;
  image: string[];
  tags: number[];
}
