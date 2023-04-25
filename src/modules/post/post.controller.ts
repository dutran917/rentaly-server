import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateApartmentDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/decorator/auth';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('/apartment')
  create(
    @Body() createPostDto: CreateApartmentDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.postService.createApartment(createPostDto, userId);
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
