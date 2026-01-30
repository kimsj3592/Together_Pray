import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Cache key prefixes for different data types
 */
export const CacheKeys = {
  GROUP: 'group',
  USER: 'user',
  PRAYER_STATS: 'prayer_stats',
  MEMBERSHIP: 'membership',
} as const;

/**
 * Cache TTL values in seconds
 */
export const CacheTTL = {
  SHORT: 60,        // 1 minute - for frequently changing data (stats)
  MEDIUM: 300,      // 5 minutes - for moderately changing data (user, group info)
  LONG: 3600,       // 1 hour - for rarely changing data
} as const;

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Generate cache key with prefix
   */
  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Delete multiple keys matching a pattern (prefix-based)
   */
  async delByPrefix(prefix: string): Promise<void> {
    // Note: cache-manager doesn't support pattern deletion natively
    // For production, consider using Redis with SCAN command
    // This is a placeholder for the pattern
    const store = this.cacheManager.stores?.[0] as any;
    if (store?.keys) {
      const keys = await store.keys();
      if (keys) {
        const matchingKeys = keys.filter((key: string) => key.startsWith(prefix));
        await Promise.all(matchingKeys.map((key: string) => this.del(key)));
      }
    }
  }

  /**
   * Get or set cache value (read-through pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined && cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalidate group-related caches
   */
  async invalidateGroup(groupId: string): Promise<void> {
    const key = this.generateKey(CacheKeys.GROUP, groupId);
    await this.del(key);
  }

  /**
   * Invalidate user-related caches
   */
  async invalidateUser(userId: string): Promise<void> {
    const key = this.generateKey(CacheKeys.USER, userId);
    await this.del(key);
  }

  /**
   * Invalidate membership caches for user
   */
  async invalidateMembership(userId: string, groupId: string): Promise<void> {
    const key = this.generateKey(CacheKeys.MEMBERSHIP, userId, groupId);
    await this.del(key);
  }

  /**
   * Invalidate prayer stats cache
   */
  async invalidatePrayerStats(groupId: string): Promise<void> {
    const key = this.generateKey(CacheKeys.PRAYER_STATS, groupId);
    await this.del(key);
  }
}
