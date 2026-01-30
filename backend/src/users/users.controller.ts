import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/dashboard/stats')
  @ApiOperation({
    summary: '대시보드 통계 조회',
    description: '사용자의 대시보드 통계 정보(내 기도 수, 응답된 기도 수 등)를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '통계 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async getDashboardStats(@Request() req) {
    return this.usersService.getDashboardStats(req.user.userId);
  }

  @Get('me/dashboard/recent-prayers')
  @ApiOperation({
    summary: '최근 기도 제목 조회',
    description: '사용자의 최근 기도 제목을 조회합니다.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '조회할 항목 수',
    example: 3,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '최근 기도 제목 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async getRecentPrayers(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 3;
    return this.usersService.getRecentPrayers(req.user.userId, limitNum);
  }

  @Get('me/prayers')
  @ApiOperation({
    summary: '내가 작성한 기도 제목 조회',
    description: '사용자가 작성한 모든 기도 제목을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '기도 제목 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async getMyPrayers(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.usersService.getMyPrayerItems(req.user.userId, pageNum, limitNum);
  }

  @Get('me/prayed')
  @ApiOperation({
    summary: '내가 기도한 항목 조회',
    description: '사용자가 기도한 모든 기도 제목을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '기도한 항목 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async getMyPrayedItems(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.usersService.getMyPrayedItems(req.user.userId, pageNum, limitNum);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '프로필 업데이트',
    description: '사용자의 프로필 정보를 업데이트합니다.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필 업데이트 성공',
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
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateDto);
  }
}
