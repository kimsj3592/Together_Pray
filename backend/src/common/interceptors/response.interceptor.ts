import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response structure returned by the interceptor
 */
export interface Response<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Global interceptor that wraps all successful responses in a standard format
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response already has the standard format, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Check if data contains pagination metadata
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          return {
            success: true,
            data: data.items,
            meta: data.meta,
          };
        }

        // Standard response wrapper
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
