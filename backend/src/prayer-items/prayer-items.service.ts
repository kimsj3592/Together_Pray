import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePrayerItemDto } from './dto/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from './dto/update-prayer-status.dto';
import { PrayerStatus } from '@prisma/client';

@Injectable()
export class PrayerItemsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreatePrayerItemDto) {
    const { groupId, title, content, category, isAnonymous } = createDto;

    // Verify user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const prayerItem = await this.prisma.prayerItem.create({
      data: {
        groupId,
        authorId: userId,
        title,
        content,
        category,
        isAnonymous: isAnonymous ?? false,
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

    // Hide author info if anonymous
    return this.formatPrayerItem(prayerItem, userId);
  }

  async findAllByGroup(
    groupId: string,
    userId: string,
    status?: PrayerStatus,
    page = 1,
    limit = 20,
  ) {
    // Verify user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const where: any = { groupId };
    if (status) {
      where.status = status;
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
      items: items.map((item) => this.formatPrayerItem(item, userId)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const prayerItem = await this.prisma.prayerItem.findUnique({
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

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Verify user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId: prayerItem.groupId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Check if user has prayed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userReaction = await this.prisma.prayerReaction.findFirst({
      where: {
        prayerItemId: id,
        userId,
        reactedAt: {
          gte: today,
        },
      },
    });

    return {
      ...this.formatPrayerItem(prayerItem, userId),
      group: prayerItem.group,
      hasPrayedToday: !!userReaction,
    };
  }

  async updateStatus(id: string, userId: string, updateDto: UpdatePrayerStatusDto) {
    const prayerItem = await this.prisma.prayerItem.findUnique({
      where: { id },
    });

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Check if user is author or group admin
    const isAuthor = prayerItem.authorId === userId;
    const isAdmin = await this.isGroupAdmin(prayerItem.groupId, userId);

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Only the author or group admin can update the status',
      );
    }

    const updated = await this.prisma.prayerItem.update({
      where: { id },
      data: { status: updateDto.status },
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

    return this.formatPrayerItem(updated, userId);
  }

  async delete(id: string, userId: string) {
    const prayerItem = await this.prisma.prayerItem.findUnique({
      where: { id },
    });

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Only author can delete
    if (prayerItem.authorId !== userId) {
      throw new ForbiddenException('Only the author can delete this prayer item');
    }

    await this.prisma.prayerItem.delete({
      where: { id },
    });

    return { message: 'Prayer item deleted successfully' };
  }

  private formatPrayerItem(prayerItem: any, currentUserId: string) {
    const isAuthor = prayerItem.authorId === currentUserId;

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
      author: prayerItem.isAnonymous && !isAuthor
        ? { id: null, name: '익명' }
        : prayerItem.author,
      _count: prayerItem._count,
    };
  }

  private async isGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: 'admin',
      },
    });

    return !!membership;
  }
}
