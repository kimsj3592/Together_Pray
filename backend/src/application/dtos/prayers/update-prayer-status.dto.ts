/**
 * Application DTO: UpdatePrayerStatus
 * Request DTO for updating prayer item status
 */

import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PrayerStatus } from '../../../core/entities/prayer-item.entity';

export class UpdatePrayerStatusDto {
  @ApiProperty({
    description: '기도 상태',
    enum: PrayerStatus,
    example: PrayerStatus.PRAYING,
    enumName: 'PrayerStatus',
  })
  @IsEnum(PrayerStatus, { message: '유효한 상태값이 아닙니다' })
  status: PrayerStatus;
}
