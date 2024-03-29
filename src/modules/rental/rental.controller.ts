import { Controller, Get, Query, Param, Body, Post } from '@nestjs/common';
import { RentalService } from './rental.service';
import { GetListRentalDto, GetListRoomDto } from './dto/get-list-dto';
import { CreateApointmentInput } from './dto/create-apointment.dto';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('list-apartment')
  async userGetListApartment(@Query() query: GetListRentalDto) {
    return this.rentalService.userGetListApartment(query);
  }

  @Get('detail-apartment/:id')
  async userGetDetailApartment(@Param('id') id: number) {
    return this.rentalService.userGetDetailApartment(+id);
  }

  @Get('list-room')
  async userGetListRoomInApartment(@Query() input: GetListRoomDto) {
    return this.rentalService.userGetListRoomInApartment(input);
  }
  @Get('room/:id')
  async userGetRoomDetail(@Param('id') roomId: number) {
    return this.rentalService.userGetRoomDetail(roomId);
  }

  @Post('apointment')
  async createApointment(@Body() input: CreateApointmentInput) {
    return await this.rentalService.createApointment(input);
  }
  @Get('list-university')
  async getListUniversity() {
    return await this.rentalService.getListUniversity();
  }
}
