/**
 * Repository Interface: GroupMember
 * Defines the contract for group membership data access
 * Infrastructure layer must implement this interface
 */

import { GroupMember, GroupRole } from '../entities/group.entity';

export const GROUP_MEMBER_REPOSITORY = Symbol('GROUP_MEMBER_REPOSITORY');

export interface IGroupMemberRepository {
  /**
   * Find a group membership by user and group
   */
  findByUserAndGroup(userId: string, groupId: string): Promise<GroupMember | null>;

  /**
   * Check if user is a member of the group
   */
  isMember(userId: string, groupId: string): Promise<boolean>;

  /**
   * Check if user is an admin of the group
   */
  isAdmin(userId: string, groupId: string): Promise<boolean>;

  /**
   * Get user's role in the group
   */
  getRole(userId: string, groupId: string): Promise<GroupRole | null>;
}
