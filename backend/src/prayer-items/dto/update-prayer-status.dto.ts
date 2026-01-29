import { IsEnum } from 'class-validator';
import { PrayerStatus } from '@prisma/client';

export class UpdatePrayerStatusDto {
  @IsEnum(PrayerStatus, { message: '유효한 상태값이 아닙니다' })
  status: PrayerStatus;
}
