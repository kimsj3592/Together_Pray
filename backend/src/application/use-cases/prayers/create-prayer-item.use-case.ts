/**
 * Use Case: CreatePrayerItem
 * Handles the business logic for creating a new prayer item
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
import { CreatePrayerItemDto } from '../../dtos/prayers/create-prayer-item.dto';
import { PrayerItemResponse } from '../../../core/entities/prayer-item.entity';

export interface CreatePrayerItemInput {
  userId: string;
  dto: CreatePrayerItemDto;
}

@Injectable()
export class CreatePrayerItemUseCase {
  constructor(
    @Inject(PRAYER_ITEM_REPOSITORY)
    private readonly prayerItemRepository: IPrayerItemRepository,
    @Inject(GROUP_MEMBER_REPOSITORY)
    private readonly groupMemberRepository: IGroupMemberRepository,
  ) {}

  async execute(input: CreatePrayerItemInput): Promise<PrayerItemResponse> {
    const { userId, dto } = input;
    const { groupId, title, content, category, isAnonymous } = dto;

    // Verify user is a member of the group
    const isMember = await this.groupMemberRepository.isMember(userId, groupId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Create the prayer item
    const prayerItem = await this.prayerItemRepository.create({
      groupId,
      authorId: userId,
      title,
      content,
      category,
      isAnonymous: isAnonymous ?? false,
    });

    // Format and return the response
    return PrayerItemFormatterService.format(prayerItem, userId);
  }
}
