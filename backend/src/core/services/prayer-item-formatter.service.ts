/**
 * Domain Service: PrayerItemFormatter
 * Handles business logic for formatting prayer items
 * Pure domain logic with no external dependencies
 */

import {
  PrayerItemWithRelations,
  PrayerItemResponse,
  PrayerItemAuthor,
} from '../entities/prayer-item.entity';

export class PrayerItemFormatterService {
  /**
   * Format a prayer item for response, handling anonymous author logic
   */
  static format(
    prayerItem: PrayerItemWithRelations,
    currentUserId: string,
    additionalData?: {
      hasPrayedToday?: boolean;
    },
  ): PrayerItemResponse {
    const isAuthor = prayerItem.authorId === currentUserId;

    const author: PrayerItemAuthor = prayerItem.isAnonymous && !isAuthor
      ? { id: null, name: '익명' }
      : prayerItem.author;

    return {
      id: prayerItem.id,
      groupId: prayerItem.groupId,
      title: prayerItem.title,
      content: prayerItem.content,
      category: prayerItem.category,
      status: prayerItem.status,
      isAnonymous: prayerItem.isAnonymous,
      createdAt: prayerItem.createdAt,
      updatedAt: prayerItem.updatedAt,
      isAuthor,
      author,
      _count: prayerItem._count,
      group: prayerItem.group,
      hasPrayedToday: additionalData?.hasPrayedToday,
    };
  }

  /**
   * Format multiple prayer items for response
   */
  static formatMany(
    prayerItems: PrayerItemWithRelations[],
    currentUserId: string,
  ): PrayerItemResponse[] {
    return prayerItems.map((item) => this.format(item, currentUserId));
  }
}
