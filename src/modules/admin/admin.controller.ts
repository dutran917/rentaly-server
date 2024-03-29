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
  CreateLessorInput,
  ListRegisterLessorInput,
  UpdateLessorInput,
} from './dto/manage-lessor.dto';
import { UserService } from '../user/user.service';
import {
  ApproveApartmentInput,
  GetListApartmentInput,
} from './dto/manage-apartment';
import { PostService } from '../post/post.service';
import { GetRoomListDto } from '../post/dto/get-post.dto';
import { UpdateApartmentDto, UpdateRoomDto } from '../post/dto/update-post.dto';
import { ListUserInput } from './dto/manager-user';
import { UpdateInfoLessorInput } from '../lessor/dto/lessor.dto';
import { LessorService } from '../lessor/lessor.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly lessorService: LessorService,
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

  @Post('/create-lessor')
  async createLessor(@Body() input: CreateLessorInput) {
    return await this.adminService.createLessor(input);
  }
  @Get('/list-user')
  @Auth('admin')
  async getListUser(@Query() input: ListUserInput) {
    return await this.adminService.getListUser(input);
  }

  @Get('/detail-lessor/:id')
  @Auth('admin')
  async getDetailLessor(@Param('id') idLessor: number) {
    return await this.adminService.getDetailLessor(idLessor);
  }

  @Get('/detail-user/:id')
  @Auth('admin')
  async getDetailUser(@Param('id') idUser: number) {
    return await this.adminService.getDetailUser(idUser);
  }

  @Post('/edit-lessor')
  @Auth('admin')
  async editProfileLessor(@Body() input: UpdateLessorInput) {
    return await this.adminService.editProfileLessor(input);
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
  async approveApartment(@Body() input: ApproveApartmentInput) {
    return await this.adminService.approveApartment(input);
  }

  @Post('/hide-apartment')
  @Auth('admin')
  async hideApartment(
    @Body() input: { apartmentId: number; display: boolean },
  ) {
    return await this.adminService.hideApartment(input);
  }

  @Post('/block-user')
  @Auth('admin')
  async blockUser(@Body() input: { userId: number; status: boolean }) {
    return await this.adminService.blockUser(input);
  }
}
