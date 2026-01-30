import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from './guards/group-member.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({
    summary: '그룹 생성',
    description: '새로운 기도 그룹을 생성합니다. 생성자는 자동으로 관리자가 됩니다.',
  })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '그룹 생성 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async create(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(req.user.id, createGroupDto);
  }

  @Get()
  @ApiOperation({
    summary: '내 그룹 목록 조회',
    description: '현재 사용자가 속한 모든 그룹 목록을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '그룹 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async findAll(@Req() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(GroupMemberGuard)
  @ApiOperation({
    summary: '그룹 상세 조회',
    description: '특정 그룹의 상세 정보를 조회합니다. 그룹 멤버만 조회할 수 있습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '그룹 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '그룹을 찾을 수 없음',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '그룹 멤버가 아님',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.groupsService.findOne(id, req.user.id);
  }

  @Post('join')
  @ApiOperation({
    summary: '그룹 가입',
    description: '초대 코드를 사용하여 그룹에 가입합니다.',
  })
  @ApiBody({ type: JoinGroupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '그룹 가입 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패 또는 유효하지 않은 초대 코드',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 그룹 멤버임',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async join(@Req() req, @Body() joinGroupDto: JoinGroupDto) {
    return this.groupsService.joinByInviteCode(
      req.user.id,
      joinGroupDto.inviteCode,
    );
  }
}
