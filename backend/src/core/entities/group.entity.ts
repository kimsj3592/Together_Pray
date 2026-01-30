/**
 * Domain Entity: Group
 * Pure domain model independent of infrastructure (Prisma)
 */

export enum GroupRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: Date;
}

export interface GroupMemberWithUser extends GroupMember {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface GroupWithMembers extends Group {
  members: GroupMemberWithUser[];
  _count?: {
    members: number;
    prayerItems: number;
  };
}
