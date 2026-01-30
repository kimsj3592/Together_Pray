/**
 * Infrastructure: GroupMemberRepository
 * Prisma implementation of IGroupMemberRepository
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IGroupMemberRepository } from '../../../core/repositories/group-member.repository.interface';
import { GroupMember, GroupRole } from '../../../core/entities/group.entity';
import { GroupRole as PrismaGroupRole } from '@prisma/client';

@Injectable()
export class GroupMemberRepository implements IGroupMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Map Prisma GroupRole to domain GroupRole
   */
  private mapToDomainRole(role: PrismaGroupRole): GroupRole {
    const roleMap: Record<PrismaGroupRole, GroupRole> = {
      [PrismaGroupRole.admin]: GroupRole.ADMIN,
      [PrismaGroupRole.member]: GroupRole.MEMBER,
    };
    return roleMap[role];
  }

  /**
   * Transform Prisma result to domain entity
   */
  private toDomain(prismaMember: any): GroupMember {
    return {
      ...prismaMember,
      role: this.mapToDomainRole(prismaMember.role),
    };
  }

  async findByUserAndGroup(userId: string, groupId: string): Promise<GroupMember | null> {
    const result = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!result) return null;
    return this.toDomain(result);
  }

  async isMember(userId: string, groupId: string): Promise<boolean> {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });
    return !!membership;
  }

  async isAdmin(userId: string, groupId: string): Promise<boolean> {
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
        role: 'admin',
      },
    });
    return !!membership;
  }

  async getRole(userId: string, groupId: string): Promise<GroupRole | null> {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!membership) return null;
    return this.mapToDomainRole(membership.role);
  }
}
