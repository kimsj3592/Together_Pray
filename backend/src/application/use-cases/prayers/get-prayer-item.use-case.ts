/**
 * Use Case: GetPrayerItem
 * Handles the business logic for fetching a single prayer item
 */

import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  IPrayerItemRepository,
  PRAYER_ITEM_REPOSITORY,
} from '../../../core/repositories/prayer-item.repository.interface';
import {
  IGroupMemberRepository,
  GROUP_MEMBER_REPOSITORY,
} from '../../../core/repositories/group-member.repository.interface';
import { PrayerItemFormatterService } from '../../../core/services/prayer-item-formatter.service';
import { PrayerItemResponse } from '../../../core/entities/prayer-item.entity';

export interface GetPrayerItemInput {
  userId: string;
  prayerItemId: string;
}

@Injectable()
export class GetPrayerItemUseCase {
  constructor(
    @Inject(PRAYER_ITEM_REPOSITORY)
    private readonly prayerItemRepository: IPrayerItemRepository,
    @Inject(GROUP_MEMBER_REPOSITORY)
    private readonly groupMemberRepository: IGroupMemberRepository,
  ) {}

  async execute(input: GetPrayerItemInput): Promise<PrayerItemResponse> {
    const { userId, prayerItemId } = input;

    // Find the prayer item with group info
    const prayerItem = await this.prayerItemRepository.findByIdWithGroup(prayerItemId);
    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Verify user is a member of the group
    const isMember = await this.groupMemberRepository.isMember(userId, prayerItem.groupId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Check if user has prayed today
    const hasPrayedToday = await this.prayerItemRepository.hasUserReactedToday(
      prayerItemId,
      userId,
    );

    // Format and return the response
    return PrayerItemFormatterService.format(prayerItem, userId, { hasPrayedToday });
  }
}
