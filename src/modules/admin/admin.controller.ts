import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth, CurrentUser } from 'src/decorator/auth';
import {
  ApproveLessorInput,
  ListRegisterLessorInput,
} from './dto/manage-lessor.dto';
import { UserService } from '../user/user.service';
import {
  ApproveApartmentInput,
  GetListApartmentInput,
} from './dto/manage-apartment';
import { PostService } from '../post/post.service';
import { GetRoomListDto } from '../post/dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from '../post/dto/update-post.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Post('/approve-lessor')
  @Auth('admin')
  adminApproveLessor(@Body() input: ApproveLessorInput) {
    return this.adminService.adminApproveLessor(input);
  }

  @Get('/info-admin')
  @Auth('admin')
  async getInfoAdmin(@CurrentUser('id') adminId) {
    return await this.userService.getInfoUser(adminId);
  }

  @Get('/register-lessor')
  @Auth('admin')
  async getListRegisterLessor(@Query() input: ListRegisterLessorInput) {
    return await this.adminService.getListRegisterLessor(input);
  }
  @Get('/detail-lessor/:id')
  @Auth('admin')
  async getDetailLessor(@Param('id') idLessor: number) {
    return await this.adminService.getDetailLessor(idLessor);
  }

  @Get('/list-apartment')
  @Auth('admin')
  async getListApartment(@Query() input: GetListApartmentInput) {
    return await this.adminService.getListApartment(input);
  }

  @Get('/detail-apartment/:id')
  @Auth('admin')
  async getDetailApartment(@Param('id') apartmentId) {
    return await this.postService.getDetailApartment(apartmentId);
  }

  @Auth('admin')
  @Get('/room-list/:id')
  getRoomsInApartment(@Param('id') id: number, @Query() input: GetRoomListDto) {
    return this.postService.getRoomsInApartment(id, input);
  }

  @Auth('admin')
  @Patch('/edit-apartment')
  updateApartment(@Body() input: UpdateApartmentDto) {
    return this.postService.updateApartment(input);
  }

  @Auth('admin')
  @Patch('/edit-room')
  updateRoom(@Body() input: UpdateRoomDto) {
    return this.postService.updateRoom(input);
  }

  @Post('/approve-apartment')
  @Auth('admin')
  async approveApartment(@Query() input: ApproveApartmentInput) {
    return await this.adminService.approveApartment(input);
  }
}
