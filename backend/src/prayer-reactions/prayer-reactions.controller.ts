import {
  Controller,
  Post,
  Get,
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
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PrayerReactionsService } from './prayer-reactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('prayer-reactions')
@Controller('prayer-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PrayerReactionsController {
  constructor(
    private readonly prayerReactionsService: PrayerReactionsService,
  ) {}

  @Post(':id/pray')
  @Throttle({ default: { ttl: 60000, limit: 30 } }) // 30 requests per minute for prayer reactions
  @ApiOperation({
    summary: '기도하기',
    description: '기도 제목에 대해 "기도했습니다" 반응을 남깁니다. 하루에 한 번만 가능합니다.',
  })
  @ApiParam({ name: 'id', description: '기도 제목 ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '기도 반응 기록 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '오늘 이미 기도함',
    type: ApiErrorResponse,
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
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '요청 횟수 초과 (1분당 30회 제한)',
    type: ApiErrorResponse,
  })
  async pray(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerReactionsService.pray(prayerItemId, req.user.id);
  }

  @Get(':id/prayers')
  @ApiOperation({
    summary: '기도한 사람 목록 조회',
    description: '해당 기도 제목에 기도한 사람들의 목록을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '기도 제목 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '기도한 사람 목록',
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
  async getPrayersList(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerReactionsService.getPrayersList(
      prayerItemId,
      req.user.id,
    );
  }
}
