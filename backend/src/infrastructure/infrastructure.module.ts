/**
 * Infrastructure Module
 * Provides shared infrastructure components (database, repositories)
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './persistence/prisma/prisma.service';
import { PrayerItemRepository } from './persistence/repositories/prayer-item.repository';
import { GroupMemberRepository } from './persistence/repositories/group-member.repository';
import { PRAYER_ITEM_REPOSITORY } from '../core/repositories/prayer-item.repository.interface';
import { GROUP_MEMBER_REPOSITORY } from '../core/repositories/group-member.repository.interface';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRAYER_ITEM_REPOSITORY,
      useClass: PrayerItemRepository,
    },
    {
      provide: GROUP_MEMBER_REPOSITORY,
      useClass: GroupMemberRepository,
    },
  ],
  exports: [
    PrismaService,
    PRAYER_ITEM_REPOSITORY,
    GROUP_MEMBER_REPOSITORY,
  ],
})
export class InfrastructureModule {}
