import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrayerReactionsService {
  constructor(private prisma: PrismaService) {}

  async pray(prayerItemId: string, userId: string) {
    // Check if prayer item exists
    const prayerItem = await this.prisma.prayerItem.findUnique({
      where: { id: prayerItemId },
    });

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Verify user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        userId,
        groupId: prayerItem.groupId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Check if user has already prayed today (Korean time zone)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingReaction = await this.prisma.prayerReaction.findFirst({
      where: {
        prayerItemId,
        userId,
        reactedAt: {
          gte: today,
        },
      },
    });

    if (existingReaction) {
      throw new BadRequestException('Already prayed for this item today');
    }

    // Create prayer reaction
    await this.prisma.prayerReaction.create({
      data: {
        prayerItemId,
        userId,
        reactedAt: today,
      },
    });

    // Get total prayer count
    const prayCount = await this.getPrayCount(prayerItemId);

    return {
      message: 'Prayer recorded successfully',
      prayCount,
      hasPrayedToday: true,
    };
  }

  async getPrayCount(prayerItemId: string): Promise<number> {
    const count = await this.prisma.prayerReaction.count({
      where: { prayerItemId },
    });

    return count;
  }

  async getPrayersList(prayerItemId: string, userId: string) {
    // Check if prayer item exists
    const prayerItem = await this.prisma.prayerItem.findUnique({
      where: { id: prayerItemId },
    });

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Verify user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        userId,
        groupId: prayerItem.groupId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Get list of users who prayed
    const reactions = await this.prisma.prayerReaction.findMany({
      where: { prayerItemId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        reactedAt: 'desc',
      },
    });

    return reactions.map((reaction) => ({
      id: reaction.user.id,
      name: reaction.user.name,
      prayedAt: reaction.reactedAt,
    }));
  }

  async hasUserPrayedToday(
    prayerItemId: string,
    userId: string,
  ): Promise<boolean> {
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
