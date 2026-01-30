import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorMessages } from '../constants/error-codes';

/**
 * Global exception filter that transforms all exceptions into standard API error responses
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let message = ErrorMessages[ErrorCode.INTERNAL_ERROR];
    let details: any = undefined;

    // Handle HTTP exceptions (including our custom exceptions)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;

        // Check if it's our custom exception format
        if (responseObj.code && responseObj.message) {
          errorCode = responseObj.code;
          message = responseObj.message;
          details = responseObj.details;
        } else if (responseObj.message) {
          // Standard NestJS validation error
          if (Array.isArray(responseObj.message)) {
            errorCode = ErrorCode.VALIDATION_ERROR;
            message = ErrorMessages[ErrorCode.VALIDATION_ERROR];
            details = responseObj.message;
          } else {
            message = responseObj.message;
            errorCode = this.mapStatusToErrorCode(status);
          }
        }
      } else {
        message = exceptionResponse as string;
        errorCode = this.mapStatusToErrorCode(status);
      }
    } else if (exception instanceof Error) {
      // Handle standard JavaScript errors
      console.error('Unexpected error:', exception);
      message = process.env.NODE_ENV === 'production'
        ? ErrorMessages[ErrorCode.INTERNAL_ERROR]
        : exception.message;
    }

    // Build standard error response
    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Map HTTP status codes to error codes for non-custom exceptions
   */
  private mapStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.AUTH_UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }
}
