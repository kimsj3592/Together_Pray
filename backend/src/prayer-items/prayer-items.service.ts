/**
 * PrayerItemsService
 * Legacy service for backward compatibility
 * Wraps the new Clean Architecture use cases
 *
 * @deprecated Use the use cases directly for new code
 */

import { Injectable, Inject } from '@nestjs/common';
import { CreatePrayerItemDto } from '../application/dtos/prayers/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from '../application/dtos/prayers/update-prayer-status.dto';
import { CreatePrayerItemUseCase } from '../application/use-cases/prayers/create-prayer-item.use-case';
import { GetPrayerItemsByGroupUseCase } from '../application/use-cases/prayers/get-prayer-items-by-group.use-case';
import { GetPrayerItemUseCase } from '../application/use-cases/prayers/get-prayer-item.use-case';
import { UpdatePrayerStatusUseCase } from '../application/use-cases/prayers/update-prayer-status.use-case';
import { DeletePrayerItemUseCase } from '../application/use-cases/prayers/delete-prayer-item.use-case';
import { PrayerStatus } from '../core/entities/prayer-item.entity';

@Injectable()
export class PrayerItemsService {
  constructor(
    private readonly createPrayerItemUseCase: CreatePrayerItemUseCase,
    private readonly getPrayerItemsByGroupUseCase: GetPrayerItemsByGroupUseCase,
    private readonly getPrayerItemUseCase: GetPrayerItemUseCase,
    private readonly updatePrayerStatusUseCase: UpdatePrayerStatusUseCase,
    private readonly deletePrayerItemUseCase: DeletePrayerItemUseCase,
  ) {}

  async create(userId: string, createDto: CreatePrayerItemDto) {
    return this.createPrayerItemUseCase.execute({ userId, dto: createDto });
  }

  async findAllByGroup(
    groupId: string,
    userId: string,
    status?: PrayerStatus,
    page = 1,
    limit = 20,
  ) {
    return this.getPrayerItemsByGroupUseCase.execute({
      userId,
      groupId,
      status,
      page,
      limit,
    });
  }

  async findOne(id: string, userId: string) {
    return this.getPrayerItemUseCase.execute({
      userId,
      prayerItemId: id,
    });
  }

  async updateStatus(id: string, userId: string, updateDto: UpdatePrayerStatusDto) {
    return this.updatePrayerStatusUseCase.execute({
      userId,
      prayerItemId: id,
      dto: updateDto,
    });
  }

  async delete(id: string, userId: string) {
    return this.deletePrayerItemUseCase.execute({
      userId,
      prayerItemId: id,
    });
  }
}
