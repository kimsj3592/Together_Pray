/**
 * Use Case: UpdatePrayerStatus
 * Handles the business logic for updating a prayer item's status
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
import { UpdatePrayerStatusDto } from '../../dtos/prayers/update-prayer-status.dto';
import { PrayerItemResponse } from '../../../core/entities/prayer-item.entity';

export interface UpdatePrayerStatusInput {
  userId: string;
  prayerItemId: string;
  dto: UpdatePrayerStatusDto;
}

@Injectable()
export class UpdatePrayerStatusUseCase {
  constructor(
    @Inject(PRAYER_ITEM_REPOSITORY)
    private readonly prayerItemRepository: IPrayerItemRepository,
    @Inject(GROUP_MEMBER_REPOSITORY)
    private readonly groupMemberRepository: IGroupMemberRepository,
  ) {}

  async execute(input: UpdatePrayerStatusInput): Promise<PrayerItemResponse> {
    const { userId, prayerItemId, dto } = input;

    // Find the prayer item
    const prayerItem = await this.prayerItemRepository.findById(prayerItemId);
    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Check if user is author or group admin
    const isAuthor = prayerItem.authorId === userId;
    const isAdmin = await this.groupMemberRepository.isAdmin(userId, prayerItem.groupId);

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Only the author or group admin can update the status',
      );
    }

    // Update the status
    const updatedPrayerItem = await this.prayerItemRepository.updateStatus(
      prayerItemId,
      dto.status,
    );

    // Format and return the response
    return PrayerItemFormatterService.format(updatedPrayerItem, userId);
  }
}
