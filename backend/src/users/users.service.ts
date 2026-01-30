import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, PrayerStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(email: string, password: string, name: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async getDashboardStats(userId: string): Promise<{
    praying: number;
    partialAnswer: number;
    answered: number;
  }> {
    // Get all groups the user is a member of
    const userGroups = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const groupIds = userGroups.map((g) => g.groupId);

    if (groupIds.length === 0) {
      return {
        praying: 0,
        partialAnswer: 0,
        answered: 0,
      };
    }

    // Count prayers by status across all user's groups
    const [prayingCount, partialAnswerCount, answeredCount] = await Promise.all([
      this.prisma.prayerItem.count({
        where: {
          groupId: { in: groupIds },
          status: PrayerStatus.praying,
        },
      }),
      this.prisma.prayerItem.count({
        where: {
          groupId: { in: groupIds },
          status: PrayerStatus.partial_answer,
        },
      }),
      this.prisma.prayerItem.count({
        where: {
          groupId: { in: groupIds },
          status: PrayerStatus.answered,
        },
      }),
    ]);

    return {
      praying: prayingCount,
      partialAnswer: partialAnswerCount,
      answered: answeredCount,
    };
  }

  async getRecentPrayers(userId: string, limit: number) {
    // Get all groups the user is a member of
    const userGroups = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const groupIds = userGroups.map((g) => g.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    // Get recent prayer items from all user's groups
    const prayerItems = await this.prisma.prayerItem.findMany({
      where: {
        groupId: { in: groupIds },
      },
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Check if user has prayed today for each prayer item
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prayerItemIds = prayerItems.map((item) => item.id);

    const userReactions = await this.prisma.prayerReaction.findMany({
      where: {
        prayerItemId: { in: prayerItemIds },
        userId,
        reactedAt: {
          gte: today,
        },
      },
      select: {
        prayerItemId: true,
      },
    });

    const prayedTodaySet = new Set(userReactions.map((r) => r.prayerItemId));

    // Format the response
    return prayerItems.map((item) => {
      const isAuthor = item.authorId === userId;

      return {
        id: item.id,
        title: item.title,
        content: item.content,
        status: item.status,
        isAnonymous: item.isAnonymous,
        createdAt: item.createdAt,
        author: item.isAnonymous && !isAuthor
          ? { id: null, name: '익명' }
          : item.author,
        group: item.group,
        hasPrayedToday: prayedTodaySet.has(item.id),
        _count: item._count,
      };
    });
  }

  async getMyPrayerItems(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.prayerItem.findMany({
        where: { authorId: userId },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.prayerItem.count({ where: { authorId: userId } }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        groupId: item.groupId,
        title: item.title,
        content: item.content,
        category: item.category,
        status: item.status,
        isAnonymous: item.isAnonymous,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: item.author,
        group: item.group,
        _count: item._count,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyPrayedItems(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Get prayer items that the user has reacted to
    const [reactions, total] = await Promise.all([
      this.prisma.prayerReaction.findMany({
        where: { userId },
        include: {
          prayerItem: {
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
          },
        },
        orderBy: { reactedAt: 'desc' },
        skip,
        take: limit,
        distinct: ['prayerItemId'],
      }),
      this.prisma.prayerReaction.findMany({
        where: { userId },
        distinct: ['prayerItemId'],
      }).then(r => r.length),
    ]);

    return {
      items: reactions.map((reaction) => {
        const item = reaction.prayerItem;
        const isAuthor = item.authorId === userId;

        return {
          id: item.id,
          groupId: item.groupId,
          title: item.title,
          content: item.content,
          category: item.category,
          status: item.status,
          isAnonymous: item.isAnonymous,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          lastPrayedAt: reaction.reactedAt,
          author: item.isAnonymous && !isAuthor
            ? { id: null, name: '익명' }
            : item.author,
          group: item.group,
          _count: item._count,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateDto,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}
