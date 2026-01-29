import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from './guards/group-member.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(req.user.id, createGroupDto);
  }

  @Get()
  async findAll(@Req() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(GroupMemberGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    return this.groupsService.findOne(id, req.user.id);
  }

  @Post('join')
  async join(@Req() req, @Body() joinGroupDto: JoinGroupDto) {
    return this.groupsService.joinByInviteCode(
      req.user.id,
      joinGroupDto.inviteCode,
    );
  }
}
