import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/decorator/auth';
import { ApproveLessorInput } from './dto/manage-lessor.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/approve-lessor')
  @Auth('admin')
  adminApproveLessor(@Body() input: ApproveLessorInput) {
    return this.adminService.adminApproveLessor(input);
  }
}
