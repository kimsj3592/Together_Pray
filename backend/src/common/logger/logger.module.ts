import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for structured logging
 */
const logFormat = printf(({ level, message, timestamp, context, trace, ...metadata }) => {
  let log = `${timestamp} [${level}]`;

  if (context) {
    log += ` [${context}]`;
  }

  log += `: ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }

  // Add stack trace if present
  if (trace) {
    log += `\n${trace}`;
  }

  return log;
});

/**
 * JSON format for production logs (better for log aggregation)
 */
const jsonFormat = printf(({ level, message, timestamp, context, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    context,
    message,
    ...metadata,
  });
});

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const logLevel = configService.get('LOG_LEVEL', isProduction ? 'info' : 'debug');

        const transports: winston.transport[] = [
          // Console transport
          new winston.transports.Console({
            level: logLevel,
            format: combine(
              timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              errors({ stack: true }),
              isProduction ? jsonFormat : combine(colorize(), logFormat),
            ),
          }),
        ];

        // File transport for production
        if (isProduction) {
          // Error logs
          transports.push(
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
              format: combine(
                timestamp(),
                errors({ stack: true }),
                jsonFormat,
              ),
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),
          );

          // Combined logs
          transports.push(
            new winston.transports.File({
              filename: 'logs/combined.log',
              format: combine(
                timestamp(),
                errors({ stack: true }),
                jsonFormat,
              ),
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),
          );
        }

        return {
          transports,
          // Prevent logging sensitive data
          format: combine(
            timestamp(),
            errors({ stack: true }),
          ),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
