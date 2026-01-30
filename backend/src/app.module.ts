import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { PrayerItemsModule } from './prayer-items/prayer-items.module';
import { PrayerUpdatesModule } from './prayer-updates/prayer-updates.module';
import { PrayerReactionsModule } from './prayer-reactions/prayer-reactions.module';
import { PrismaService } from './prisma.service';
import { CacheModule } from './common/cache';
import { ThrottlerModule } from './common/throttler';
import { LoggerModule } from './common/logger';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Infrastructure modules
    CacheModule,      // In-memory caching for performance
    ThrottlerModule,  // Rate limiting for security
    LoggerModule,     // Structured logging

    // Feature modules
    AuthModule,
    UsersModule,
    GroupsModule,
    PrayerItemsModule,
    PrayerUpdatesModule,
    PrayerReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
