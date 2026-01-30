/**
 * Response DTOs for Prayer Items
 * Used for Swagger documentation
 */

import { ApiProperty } from '@nestjs/swagger';
import { PrayerStatus } from '../../core/entities/prayer-item.entity';

export class PrayerAuthorDto {
  @ApiProperty({ description: '작성자 ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: '작성자 이름', example: '홍길동' })
  name: string;
}

export class PrayerItemResponseDto {
  @ApiProperty({ description: '기도 제목 ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: '그룹 ID', example: 'uuid-string' })
  groupId: string;

  @ApiProperty({ description: '제목', example: '가족의 건강을 위한 기도' })
  title: string;

  @ApiProperty({ description: '내용', example: '가족 모두가 건강하고 평안하게 지낼 수 있도록 기도합니다.' })
  content: string;

  @ApiProperty({
    description: '기도 상태',
    enum: PrayerStatus,
    example: PrayerStatus.PRAYING,
  })
  status: PrayerStatus;

  @ApiProperty({ description: '카테고리', example: '건강', required: false })
  category?: string;

  @ApiProperty({ description: '익명 여부', example: false })
  isAnonymous: boolean;

  @ApiProperty({ description: '기도 횟수', example: 5 })
  prayerCount: number;

  @ApiProperty({ description: '작성자 정보', type: PrayerAuthorDto })
  author: PrayerAuthorDto;

  @ApiProperty({ description: '생성 일시', example: '2026-01-30T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시', example: '2026-01-30T12:00:00.000Z' })
  updatedAt: Date;
}

export class PrayerItemListResponseDto {
  @ApiProperty({ description: '기도 제목 목록', type: [PrayerItemResponseDto] })
  items: PrayerItemResponseDto[];

  @ApiProperty({
    description: '페이지네이션 메타데이터',
    example: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
