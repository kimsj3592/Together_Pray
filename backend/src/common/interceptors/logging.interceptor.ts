import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request, Response } from 'express';

/**
 * Fields to redact from logs for security
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'authorization',
  'cookie',
  'jwt',
  'secret',
  'apikey',
  'api_key',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
];

/**
 * Interceptor for logging HTTP requests and responses
 * Logs request details, response time, and errors
 * Redacts sensitive information from logs
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = (request as any).user?.id || 'anonymous';

    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log incoming request
    this.logger.info('Incoming request', {
      context: 'HTTP',
      requestId,
      method,
      url,
      userId,
      ip,
      userAgent: this.truncate(userAgent, 100),
      body: this.redactSensitiveData(request.body),
    });

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Log successful response
        this.logger.info('Request completed', {
          context: 'HTTP',
          requestId,
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          userId,
        });

        // Log slow requests as warnings
        if (duration > 1000) {
          this.logger.warn('Slow request detected', {
            context: 'PERFORMANCE',
            requestId,
            method,
            url,
            duration: `${duration}ms`,
          });
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log error
        this.logger.error('Request failed', {
          context: 'HTTP',
          requestId,
          method,
          url,
          duration: `${duration}ms`,
          userId,
          error: error.message,
          stack: error.stack,
        });

        throw error;
      }),
    );
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Redact sensitive data from objects
   */
  private redactSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const redacted: Record<string, any> = {};

    for (const key of Object.keys(data)) {
      if (SENSITIVE_FIELDS.some((field) =>
        key.toLowerCase().includes(field.toLowerCase()),
      )) {
        redacted[key] = '[REDACTED]';
      } else if (typeof data[key] === 'object') {
        redacted[key] = this.redactSensitiveData(data[key]);
      } else {
        redacted[key] = data[key];
      }
    }

    return redacted;
  }

  /**
   * Truncate long strings
   */
  private truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength) + '...';
  }
}
