import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePrayerUpdateDto } from './dto/create-prayer-update.dto';

@Injectable()
export class PrayerUpdatesService {
  constructor(private prisma: PrismaService) {}

  async create(
    prayerItemId: string,
    userId: string,
    createDto: CreatePrayerUpdateDto,
  ) {
    // Find prayer item
    const prayerItem = await this.prisma.prayerItem.findUnique({
      where: { id: prayerItemId },
    });

    if (!prayerItem) {
      throw new NotFoundException('Prayer item not found');
    }

    // Only author can create updates
    if (prayerItem.authorId !== userId) {
      throw new ForbiddenException(
        'Only the author can create updates for this prayer item',
      );
    }

    const update = await this.prisma.prayerUpdate.create({
      data: {
        prayerItemId,
        content: createDto.content,
      },
    });

    return update;
  }

  async findAllByPrayerItem(prayerItemId: string, userId: string) {
    // Find prayer item
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

    const updates = await this.prisma.prayerUpdate.findMany({
      where: { prayerItemId },
      orderBy: { createdAt: 'asc' },
    });

    return updates;
  }

  async delete(updateId: string, userId: string) {
    // Find the update
    const update = await this.prisma.prayerUpdate.findUnique({
      where: { id: updateId },
      include: {
        prayerItem: true,
      },
    });

    if (!update) {
      throw new NotFoundException('Prayer update not found');
    }

    // Only the prayer item author can delete updates
    if (update.prayerItem.authorId !== userId) {
      throw new ForbiddenException(
        'Only the prayer item author can delete this update',
      );
    }

    await this.prisma.prayerUpdate.delete({
      where: { id: updateId },
    });

    return { message: 'Prayer update deleted successfully' };
  }
}
