/**
 * Use Case: GetPrayerItemsByGroup
 * Handles the business logic for fetching prayer items by group
 */

import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import {
  IPrayerItemRepository,
  PRAYER_ITEM_REPOSITORY,
} from '../../../core/repositories/prayer-item.repository.interface';
import {
  IGroupMemberRepository,
  GROUP_MEMBER_REPOSITORY,
} from '../../../core/repositories/group-member.repository.interface';
import { PrayerItemFormatterService } from '../../../core/services/prayer-item-formatter.service';
import {
  PaginatedPrayerItems,
  PrayerStatus,
} from '../../../core/entities/prayer-item.entity';

export interface GetPrayerItemsByGroupInput {
  userId: string;
  groupId: string;
  status?: PrayerStatus;
  page?: number;
  limit?: number;
}

@Injectable()
export class GetPrayerItemsByGroupUseCase {
  constructor(
    @Inject(PRAYER_ITEM_REPOSITORY)
    private readonly prayerItemRepository: IPrayerItemRepository,
    @Inject(GROUP_MEMBER_REPOSITORY)
    private readonly groupMemberRepository: IGroupMemberRepository,
  ) {}

  async execute(input: GetPrayerItemsByGroupInput): Promise<PaginatedPrayerItems> {
    const { userId, groupId, status, page = 1, limit = 20 } = input;

    // Verify user is a member of the group
    const isMember = await this.groupMemberRepository.isMember(userId, groupId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Fetch prayer items
    const { items, total } = await this.prayerItemRepository.findByGroup({
      groupId,
      status,
      page,
      limit,
    });

    // Format items
    const formattedItems = PrayerItemFormatterService.formatMany(items, userId);

    return {
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
