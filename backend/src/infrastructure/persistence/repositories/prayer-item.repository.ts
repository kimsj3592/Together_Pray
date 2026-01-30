/**
 * Infrastructure: PrayerItemRepository
 * Prisma implementation of IPrayerItemRepository
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IPrayerItemRepository,
  CreatePrayerItemData,
  FindPrayerItemsOptions,
  FindPrayerItemsResult,
} from '../../../core/repositories/prayer-item.repository.interface';
import {
  PrayerItemWithRelations,
  PrayerStatus,
} from '../../../core/entities/prayer-item.entity';
import { PrayerStatus as PrismaPrayerStatus } from '@prisma/client';

@Injectable()
export class PrayerItemRepository implements IPrayerItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Map domain PrayerStatus to Prisma PrayerStatus
   */
  private mapToPrismaStatus(status: PrayerStatus): PrismaPrayerStatus {
    const statusMap: Record<PrayerStatus, PrismaPrayerStatus> = {
      [PrayerStatus.PRAYING]: PrismaPrayerStatus.praying,
      [PrayerStatus.PARTIAL_ANSWER]: PrismaPrayerStatus.partial_answer,
      [PrayerStatus.ANSWERED]: PrismaPrayerStatus.answered,
    };
    return statusMap[status];
  }

  /**
   * Map Prisma PrayerStatus to domain PrayerStatus
   */
  private mapToDomainStatus(status: PrismaPrayerStatus): PrayerStatus {
    const statusMap: Record<PrismaPrayerStatus, PrayerStatus> = {
      [PrismaPrayerStatus.praying]: PrayerStatus.PRAYING,
      [PrismaPrayerStatus.partial_answer]: PrayerStatus.PARTIAL_ANSWER,
      [PrismaPrayerStatus.answered]: PrayerStatus.ANSWERED,
    };
    return statusMap[status];
  }

  /**
   * Transform Prisma result to domain entity
   */
  private toDomain(prismaItem: any): PrayerItemWithRelations {
    return {
      ...prismaItem,
      status: this.mapToDomainStatus(prismaItem.status),
    };
  }

  async create(data: CreatePrayerItemData): Promise<PrayerItemWithRelations> {
    const result = await this.prisma.prayerItem.create({
      data: {
        groupId: data.groupId,
        authorId: data.authorId,
        title: data.title,
        content: data.content,
        category: data.category,
        isAnonymous: data.isAnonymous ?? false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });

    return this.toDomain(result);
  }

  async findById(id: string): Promise<PrayerItemWithRelations | null> {
    const result = await this.prisma.prayerItem.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
            updates: true,
          },
        },
      },
    });

    if (!result) return null;
    return this.toDomain(result);
  }

  async findByIdWithGroup(id: string): Promise<PrayerItemWithRelations | null> {
    const result = await this.prisma.prayerItem.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
            updates: true,
          },
        },
      },
    });

    if (!result) return null;
    return this.toDomain(result);
  }

  async findByGroup(options: FindPrayerItemsOptions): Promise<FindPrayerItemsResult> {
    const { groupId, status, page = 1, limit = 20 } = options;

    const where: any = { groupId };
    if (status) {
      where.status = this.mapToPrismaStatus(status);
    }

    const [items, total] = await Promise.all([
      this.prisma.prayerItem.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
              updates: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.prayerItem.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
    };
  }

  async updateStatus(id: string, status: PrayerStatus): Promise<PrayerItemWithRelations> {
    const result = await this.prisma.prayerItem.update({
      where: { id },
      data: { status: this.mapToPrismaStatus(status) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });

    return this.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prayerItem.delete({
      where: { id },
    });
  }

  async hasUserReactedToday(prayerItemId: string, userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reaction = await this.prisma.prayerReaction.findFirst({
      where: {
        prayerItemId,
        userId,
        reactedAt: {
          gte: today,
        },
      },
    });

    return !!reaction;
  }
}
