/**
 * Domain Entity: PrayerItem
 * Pure domain model independent of infrastructure (Prisma)
 */

export enum PrayerStatus {
  PRAYING = 'praying',
  PARTIAL_ANSWER = 'partial_answer',
  ANSWERED = 'answered',
}

export interface PrayerItemAuthor {
  id: string | null;
  name: string;
}

export interface PrayerItemGroup {
  id: string;
  name: string;
}

export interface PrayerItemCounts {
  reactions: number;
  comments: number;
  updates?: number;
}

export interface PrayerItem {
  id: string;
  groupId: string;
  authorId: string;
  title: string;
  content: string;
  category: string | null;
  status: PrayerStatus;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerItemWithRelations extends PrayerItem {
  author: PrayerItemAuthor;
  group?: PrayerItemGroup;
  _count: PrayerItemCounts;
}

export interface PrayerItemResponse {
  id: string;
  groupId: string;
  title: string;
  content: string;
  category: string | null;
  status: PrayerStatus;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAuthor: boolean;
  author: PrayerItemAuthor;
  _count: PrayerItemCounts;
  group?: PrayerItemGroup;
  hasPrayedToday?: boolean;
}

export interface PaginatedPrayerItems {
  items: PrayerItemResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
