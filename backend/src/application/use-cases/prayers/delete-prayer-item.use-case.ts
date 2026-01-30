/**
 * Use Case: DeletePrayerItem
 * Handles the business logic for deleting a prayer item
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

export interface DeletePrayerItemInput {
  userId: string;
  prayerItemId: string;
}

export interface DeletePrayerItemResult {
  message: string;
}

@Injectable()
export class DeletePrayerItemUseCase {
  constructor(
    @Inject(PRAYER_ITEM_REPOSITORY)
    private readonly prayerItemRepository: IPrayerItemRepository,
  ) {}

  async execute(input: DeletePrayerItemInput): Promise<DeletePrayerItemResult> {
    const { userId, prayerItemId } = input;

    // Find the prayer item
    const prayerItem = await this.prayerItemRepository.findById(prayerItemId);
    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Only author can delete
    if (prayerItem.authorId !== userId) {
      throw new ForbiddenException('Only the author can delete this prayer item');
    }

    // Delete the prayer item
    await this.prayerItemRepository.delete(prayerItemId);

    return { message: 'Prayer item deleted successfully' };
  }
}
