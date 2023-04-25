export class CreateApartmentDto {
  title: string;
  subtitle: string;
  content: string;
  address: string;
  lat: number;
  long: number;
  district: string;
  province: string;
  image: string[];
  tags: number[];
}
