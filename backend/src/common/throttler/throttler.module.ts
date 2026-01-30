import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

/**
 * Rate limiting configuration
 * Different limits for different endpoint types
 */
export const THROTTLE_CONFIG = {
  // Default rate limit: 100 requests per minute
  DEFAULT: {
    name: 'default',
    ttl: 60000,   // 1 minute in milliseconds
    limit: 100,
  },
  // Strict limit for auth endpoints: 5 requests per minute
  AUTH: {
    name: 'auth',
    ttl: 60000,
    limit: 5,
  },
  // Moderate limit for prayer reactions: 30 requests per minute
  REACTION: {
    name: 'reaction',
    ttl: 60000,
    limit: 30,
  },
} as const;

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        throttlers: [
          {
            name: THROTTLE_CONFIG.DEFAULT.name,
            ttl: configService.get<number>('THROTTLE_TTL', THROTTLE_CONFIG.DEFAULT.ttl),
            limit: configService.get<number>('THROTTLE_LIMIT', THROTTLE_CONFIG.DEFAULT.limit),
          },
        ],
        // Skip throttling for these paths
        skipIf: (context) => {
          const request = context.switchToHttp().getRequest();
          // Skip health check endpoint
          return request.url === '/health' || request.url === '/';
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [NestThrottlerModule],
})
export class ThrottlerModule {}
