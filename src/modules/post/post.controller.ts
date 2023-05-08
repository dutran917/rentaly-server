import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateApartmentDto, CreateRoomDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/decorator/auth';
import { GetListApartmentDto, GetRoomListDto } from './dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('/apartment')
  createApartment(
    @Body() createPostDto: CreateApartmentDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.postService.createApartment(createPostDto, userId);
  }

  @UseGuards(AuthGuard)
  @Post('/room')
  createRoom(@Body() input: CreateRoomDto) {
    return this.postService.createRoom(input);
  }

  @UseGuards(AuthGuard)
  @Get('/apartment-list')
  getListApartment(
    @Query() query: GetListApartmentDto,
    @CurrentUser('id') ownerId,
  ) {
    return this.postService.getListApartment(query, ownerId);
  }

  @UseGuards(AuthGuard)
  @Get('/apartment/:id')
  getApartmentInfo(
    @Param('id') id: number,
    @CurrentUser('id') ownerId: number,
  ) {
    return this.postService.getDetailApartment(id, ownerId);
  }

  @UseGuards(AuthGuard)
  @Get('/room-list/:id')
  getRoomsInApartment(@Param('id') id: number, @Query() input: GetRoomListDto) {
    return this.postService.getRoomsInApartment(id, input);
  }

  @UseGuards(AuthGuard)
  @Patch('/edit-apartment')
  updateApartment(@Body() input: UpdateApartmentDto) {
    return this.postService.updateApartment(input);
  }

  @UseGuards(AuthGuard)
  @Patch('/edit-room')
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
