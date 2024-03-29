import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth, CurrentUser } from 'src/decorator/auth';
import { CreateApartmentDto, CreateRoomDto } from './dto/create-post.dto';
import { GetListApartmentDto, GetRoomListDto } from './dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth('lessor')
  @Post('/apartment')
  async createApartment(
    @Body() createPostDto: CreateApartmentDto,
    @CurrentUser('id') userId: number,
  ) {
    return await this.postService.createApartment(createPostDto, userId);
  }

  @Auth('lessor')
  @Post('/room')
  createRoom(@Body() input: CreateRoomDto) {
    return this.postService.createRoom(input);
  }

  @Auth('lessor')
  @Get('/all-apartment')
  getAllApartment(@CurrentUser('id') ownerId) {
    return this.postService.getAllApartment(+ownerId);
  }

  @Auth('lessor')
  @Get('/apartment-list')
  getListApartment(
    @Query() query: GetListApartmentDto,
    @CurrentUser('id') ownerId,
  ) {
    return this.postService.getListApartment(query, ownerId);
  }

  @Auth('lessor')
  @Get('/apartment/:id')
  getApartmentInfo(
    @Param('id') id: number,
    @CurrentUser('id') ownerId: number,
  ) {
    return this.postService.getDetailApartment(id, ownerId);
  }

  @Auth('lessor')
  @Get('/room/:id')
  getRoomInfo(@Param('id') roomId: number, @CurrentUser('id') ownerId: number) {
    return this.postService.getRoomInfo(+roomId, +ownerId);
  }
  @Auth('lessor')
  @Get('/room-list/:id')
  getRoomsInApartment(@Param('id') id: number, @Query() input: GetRoomListDto) {
    return this.postService.getRoomsInApartment(id, input);
  }

  @Auth('lessor')
  @Post('/hide-room')
  hideRoom(@Body() input: { roomId: number; display: boolean }) {
    return this.postService.hideRoom(input);
  }
  @Auth('lessor')
  @Patch('/edit-apartment')
  updateApartment(@Body() input: UpdateApartmentDto) {
    return this.postService.updateApartment(input);
  }

  @Auth('lessor')
  @Post('/edit-room')
  updateRoom(@Body() input: UpdateRoomDto) {
    return this.postService.updateRoom(input);
  }

  @Get('/apartment-tag')
  getApartmentTags() {
    return this.postService.getApartmentTag();
  }
  @Get('/room-tag')
  getRoomTags() {
    return this.postService.getRoomTag();
  }
}
