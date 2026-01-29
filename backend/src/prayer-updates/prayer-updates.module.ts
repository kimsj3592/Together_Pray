import { Module } from '@nestjs/common';
import { PrayerUpdatesController } from './prayer-updates.controller';
import { PrayerUpdatesService } from './prayer-updates.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PrayerUpdatesController],
  providers: [PrayerUpdatesService, PrismaService],
})
export class PrayerUpdatesModule {}
