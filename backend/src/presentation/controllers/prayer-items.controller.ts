/**
 * Presentation Layer: PrayerItemsController
 * HTTP endpoint handlers for prayer items
 * Controllers should only call use cases, no business logic here
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePrayerItemDto } from '../../application/dtos/prayers/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from '../../application/dtos/prayers/update-prayer-status.dto';
import { CreatePrayerItemUseCase } from '../../application/use-cases/prayers/create-prayer-item.use-case';
import { GetPrayerItemsByGroupUseCase } from '../../application/use-cases/prayers/get-prayer-items-by-group.use-case';
import { GetPrayerItemUseCase } from '../../application/use-cases/prayers/get-prayer-item.use-case';
import { UpdatePrayerStatusUseCase } from '../../application/use-cases/prayers/update-prayer-status.use-case';
import { DeletePrayerItemUseCase } from '../../application/use-cases/prayers/delete-prayer-item.use-case';
import { PrayerStatus } from '../../core/entities/prayer-item.entity';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('prayer-items')
@Controller('prayer-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PrayerItemsController {
  constructor(
    private readonly createPrayerItemUseCase: CreatePrayerItemUseCase,
    private readonly getPrayerItemsByGroupUseCase: GetPrayerItemsByGroupUseCase,
    private readonly getPrayerItemUseCase: GetPrayerItemUseCase,
    private readonly updatePrayerStatusUseCase: UpdatePrayerStatusUseCase,
    private readonly deletePrayerItemUseCase: DeletePrayerItemUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: '기도 제목 생성',
    description: '새로운 기도 제목을 생성합니다. 그룹 멤버만 생성할 수 있습니다.',
  })
  @ApiBody({ type: CreatePrayerItemDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '기도 제목 생성 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '그룹 멤버가 아님',
    type: ApiErrorResponse,
  })
  async create(@Req() req, @Body() createDto: CreatePrayerItemDto) {
    return this.createPrayerItemUseCase.execute({
      userId: req.user.id,
      dto: createDto,
    });
  }

  @Get('group/:groupId')
  @ApiOperation({
    summary: '그룹별 기도 제목 목록 조회',
    description: '특정 그룹의 기도 제목 목록을 조회합니다. 상태별 필터링 및 페이지네이션을 지원합니다.',
  })
  @ApiParam({
    name: 'groupId',
    description: '그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PrayerStatus,
    description: '기도 상태 필터',
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
    status: HttpStatus.FORBIDDEN,
    description: '그룹 멤버가 아님',
    type: ApiErrorResponse,
  })
  async findAllByGroup(
    @Param('groupId') groupId: string,
    @Req() req,
    @Query('status') status?: PrayerStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.getPrayerItemsByGroupUseCase.execute({
      userId: req.user.id,
      groupId,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: '기도 제목 상세 조회',
    description: '특정 기도 제목의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기도 제목 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '기도 제목 조회 성공',
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
  async findOne(@Param('id') id: string, @Req() req) {
    return this.getPrayerItemUseCase.execute({
      userId: req.user.id,
      prayerItemId: id,
    });
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: '기도 상태 업데이트',
    description: '기도 제목의 상태를 변경합니다. 작성자 또는 그룹 관리자만 변경할 수 있습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기도 제목 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdatePrayerStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '상태 업데이트 성공',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '권한 없음 (작성자 또는 관리자가 아님)',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '기도 제목을 찾을 수 없음',
    type: ApiErrorResponse,
  })
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() updateDto: UpdatePrayerStatusDto,
  ) {
    return this.updatePrayerStatusUseCase.execute({
      userId: req.user.id,
      prayerItemId: id,
      dto: updateDto,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: '기도 제목 삭제',
    description: '기도 제목을 삭제합니다. 작성자만 삭제할 수 있습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기도 제목 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '삭제 성공',
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
  async delete(@Param('id') id: string, @Req() req) {
    return this.deletePrayerItemUseCase.execute({
      userId: req.user.id,
      prayerItemId: id,
    });
  }
}
