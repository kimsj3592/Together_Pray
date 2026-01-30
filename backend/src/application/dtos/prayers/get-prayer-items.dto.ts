/**
 * Application DTO: GetPrayerItems
 * Request DTO for fetching prayer items with optional filters
 */

import { IsString, IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { PrayerStatus } from '../../../core/entities/prayer-item.entity';

export class GetPrayerItemsDto {
  @IsString()
  groupId: string;

  @IsOptional()
  @IsEnum(PrayerStatus)
  status?: PrayerStatus;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
