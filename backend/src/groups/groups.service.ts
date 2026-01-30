import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CacheService, CacheKeys, CacheTTL } from '../common/cache';
import { randomUUID } from 'crypto';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(userId: string, createGroupDto: CreateGroupDto) {
    const { name, description } = createGroupDto;

    // Generate unique invite code
    const inviteCode = randomUUID();

    // Create group and add creator as admin
    const group = await this.prisma.group.create({
      data: {
        name,
        description,
        inviteCode,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Invalidate user's membership cache
    await this.cacheService.invalidateUser(userId);

    return group;
  }

  async findAll(userId: string) {
    // Find all groups where user is a member
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            prayerItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return groups;
  }

  async findOne(groupId: string, userId: string) {
    // Try to get from cache first
    const cacheKey = this.cacheService.generateKey(CacheKeys.GROUP, groupId);

    const group = await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        return this.prisma.group.findUnique({
          where: { id: groupId },
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            _count: {
              select: {
                prayerItems: true,
              },
            },
          },
        });
      },
      CacheTTL.MEDIUM, // 5 minutes
    );

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if user is a member
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return group;
  }

  async joinByInviteCode(userId: string, inviteCode: string) {
    // Find group by invite code
    const group = await this.prisma.group.findUnique({
      where: { inviteCode },
      include: {
        members: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Invalid invite code');
    }

    // Check if user is already a member
    const existingMember = group.members.find((m) => m.userId === userId);
    if (existingMember) {
      throw new ConflictException('You are already a member of this group');
    }

    // Add user as member
    await this.prisma.groupMember.create({
      data: {
        userId,
        groupId: group.id,
        role: 'member',
      },
    });

    // Invalidate caches
    await Promise.all([
      this.cacheService.invalidateGroup(group.id),
      this.cacheService.invalidateMembership(userId, group.id),
    ]);

    // Return updated group
    return this.findOne(group.id, userId);
  }

  /**
   * Check if user is a member of the group
   * Uses caching for performance optimization
   */
  async checkMembership(groupId: string, userId: string): Promise<boolean> {
    const cacheKey = this.cacheService.generateKey(
      CacheKeys.MEMBERSHIP,
      userId,
      groupId,
    );

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const membership = await this.prisma.groupMember.findFirst({
          where: {
            groupId,
            userId,
          },
          select: { id: true }, // Only select id for existence check
        });

        return !!membership;
      },
      CacheTTL.MEDIUM, // 5 minutes
    );
  }

  /**
   * Check if user is admin of the group
   * Uses optimized query with composite index
   */
  async isAdmin(groupId: string, userId: string): Promise<boolean> {
    const cacheKey = this.cacheService.generateKey(
      CacheKeys.MEMBERSHIP,
      userId,
      groupId,
      'admin',
    );

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const membership = await this.prisma.groupMember.findFirst({
          where: {
            groupId,
            userId,
            role: 'admin',
          },
          select: { id: true }, // Only select id for existence check
        });

        return !!membership;
      },
      CacheTTL.MEDIUM, // 5 minutes
    );
  }
}
