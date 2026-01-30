/**
 * PrayerItemsModule
 * Clean Architecture module for Prayer Items
 * Wires up all layers: Presentation, Application, Infrastructure
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';

// Presentation Layer
import { PrayerItemsController } from '../presentation/controllers/prayer-items.controller';

// Application Layer - Use Cases
import {
  CreatePrayerItemUseCase,
  GetPrayerItemsByGroupUseCase,
  GetPrayerItemUseCase,
  UpdatePrayerStatusUseCase,
  DeletePrayerItemUseCase,
} from '../application/use-cases/prayers';

// Infrastructure Layer - Repositories
import { PrayerItemRepository } from '../infrastructure/persistence/repositories/prayer-item.repository';
import { GroupMemberRepository } from '../infrastructure/persistence/repositories/group-member.repository';

// Core Layer - Repository Tokens
import { PRAYER_ITEM_REPOSITORY } from '../core/repositories/prayer-item.repository.interface';
import { GROUP_MEMBER_REPOSITORY } from '../core/repositories/group-member.repository.interface';

// Legacy Service (for backward compatibility)
import { PrayerItemsService } from './prayer-items.service';

@Module({
  controllers: [PrayerItemsController],
  providers: [
    // Infrastructure
    PrismaService,

    // Repository bindings (DI tokens)
    {
      provide: PRAYER_ITEM_REPOSITORY,
      useClass: PrayerItemRepository,
    },
    {
      provide: GROUP_MEMBER_REPOSITORY,
      useClass: GroupMemberRepository,
    },

    // Use Cases
    CreatePrayerItemUseCase,
    GetPrayerItemsByGroupUseCase,
    GetPrayerItemUseCase,
    UpdatePrayerStatusUseCase,
    DeletePrayerItemUseCase,

    // Legacy Service (for backward compatibility)
    PrayerItemsService,
  ],
  exports: [
    PRAYER_ITEM_REPOSITORY,
    GROUP_MEMBER_REPOSITORY,
    CreatePrayerItemUseCase,
    GetPrayerItemsByGroupUseCase,
    GetPrayerItemUseCase,
    UpdatePrayerStatusUseCase,
    DeletePrayerItemUseCase,
    PrayerItemsService,
  ],
})
export class PrayerItemsModule {}
