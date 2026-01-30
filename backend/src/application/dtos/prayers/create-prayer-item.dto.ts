/**
 * Application DTO: CreatePrayerItem
 * Request DTO for creating a prayer item
 */

import { IsString, IsNotEmpty, IsBoolean, IsOptional, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrayerItemDto {
  @ApiProperty({
    description: '그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID('4', { message: '유효한 그룹 ID를 입력해주세요' })
  @IsNotEmpty({ message: '그룹 ID는 필수입니다' })
  groupId: string;

  @ApiProperty({
    description: '기도 제목 (2-200자)',
    example: '가족의 건강을 위한 기도',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: '제목은 필수입니다' })
  @MinLength(2, { message: '제목은 2자 이상이어야 합니다' })
  @MaxLength(200, { message: '제목은 최대 200자까지 가능합니다' })
  title: string;

  @ApiProperty({
    description: '기도 내용 (5-2000자)',
    example: '가족 모두가 건강하고 평안하게 지낼 수 있도록 기도합니다.',
    minLength: 5,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty({ message: '내용은 필수입니다' })
  @MinLength(5, { message: '내용은 5자 이상이어야 합니다' })
  @MaxLength(2000, { message: '내용은 최대 2000자까지 가능합니다' })
  content: string;

  @ApiProperty({
    description: '기도 카테고리 (선택)',
    example: '건강',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: '익명 게시 여부',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
