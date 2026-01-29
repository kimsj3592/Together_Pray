import { Module } from '@nestjs/common';
import { PrayerReactionsController } from './prayer-reactions.controller';
import { PrayerReactionsService } from './prayer-reactions.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PrayerReactionsController],
  providers: [PrayerReactionsService, PrismaService],
  exports: [PrayerReactionsService],
})
export class PrayerReactionsModule {}
