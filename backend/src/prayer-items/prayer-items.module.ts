import { Module } from '@nestjs/common';
import { PrayerItemsController } from './prayer-items.controller';
import { PrayerItemsService } from './prayer-items.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PrayerItemsController],
  providers: [PrayerItemsService, PrismaService],
  exports: [PrayerItemsService],
})
export class PrayerItemsModule {}
