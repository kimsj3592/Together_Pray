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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
