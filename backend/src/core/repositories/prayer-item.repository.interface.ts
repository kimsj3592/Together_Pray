/**
 * Repository Interface: PrayerItem
 * Defines the contract for prayer item data access
 * Infrastructure layer must implement this interface
 */

import {
  PrayerItem,
  PrayerItemWithRelations,
  PrayerStatus,
} from '../entities/prayer-item.entity';

export interface CreatePrayerItemData {
  groupId: string;
  authorId: string;
  title: string;
  content: string;
  category?: string;
  isAnonymous?: boolean;
}

export interface FindPrayerItemsOptions {
  groupId: string;
  status?: PrayerStatus;
  page?: number;
  limit?: number;
}

export interface FindPrayerItemsResult {
  items: PrayerItemWithRelations[];
  total: number;
}

export const PRAYER_ITEM_REPOSITORY = Symbol('PRAYER_ITEM_REPOSITORY');

export interface IPrayerItemRepository {
  /**
   * Create a new prayer item
   */
  create(data: CreatePrayerItemData): Promise<PrayerItemWithRelations>;

  /**
   * Find a prayer item by ID
   */
  findById(id: string): Promise<PrayerItemWithRelations | null>;

  /**
   * Find a prayer item by ID with group information
   */
  findByIdWithGroup(id: string): Promise<PrayerItemWithRelations | null>;

  /**
   * Find all prayer items by group with optional filtering and pagination
   */
  findByGroup(options: FindPrayerItemsOptions): Promise<FindPrayerItemsResult>;

  /**
   * Update a prayer item's status
   */
  updateStatus(id: string, status: PrayerStatus): Promise<PrayerItemWithRelations>;

  /**
   * Delete a prayer item
   */
  delete(id: string): Promise<void>;

  /**
   * Check if user has reacted to prayer item today
   */
  hasUserReactedToday(prayerItemId: string, userId: string): Promise<boolean>;
}
