import {
  Controller,
  Get,
  Post,
  Delete,
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
import { PrayerUpdatesService } from './prayer-updates.service';
import { CreatePrayerUpdateDto } from './dto/create-prayer-update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('prayer-updates')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PrayerUpdatesController {
  constructor(private readonly prayerUpdatesService: PrayerUpdatesService) {}

  @Post('prayer-items/:id/updates')
  @ApiOperation({
    summary: '기도 업데이트 작성',
    description: '기도 제목에 대한 업데이트(진행 상황)를 작성합니다. 작성자만 작성할 수 있습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기도 제목 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: CreatePrayerUpdateDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '업데이트 작성 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '권한 없음 (작성자가 아님)',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '기도 제목을 찾을 수 없음',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async create(
    @Param('id') prayerItemId: string,
    @Req() req,
    @Body() createDto: CreatePrayerUpdateDto,
  ) {
    return this.prayerUpdatesService.create(
      prayerItemId,
      req.user.id,
      createDto,
    );
  }

  @Get('prayer-items/:id/updates')
  @ApiOperation({
    summary: '기도 업데이트 목록 조회',
    description: '특정 기도 제목의 모든 업데이트를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기도 제목 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '업데이트 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '기도 제목을 찾을 수 없음',
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
  async findAllByPrayerItem(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerUpdatesService.findAllByPrayerItem(
      prayerItemId,
      req.user.id,
    );
  }

  @Delete('prayer-updates/:id')
  @ApiOperation({
    summary: '기도 업데이트 삭제',
    description: '작성한 업데이트를 삭제합니다. 작성자만 삭제할 수 있습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '업데이트 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '업데이트 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '권한 없음 (작성자가 아님)',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '업데이트를 찾을 수 없음',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
    type: ApiErrorResponse,
  })
  async delete(@Param('id') updateId: string, @Req() req) {
    return this.prayerUpdatesService.delete(updateId, req.user.id);
  }
}
