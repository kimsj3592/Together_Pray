import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../constants/error-codes';

/**
 * Validation exception
 * Used for input validation errors
 */
export class ValidationException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR,
    public readonly details?: any,
  ) {
    super(
      {
        code: errorCode,
        message: ErrorMessages[errorCode],
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Factory method for validation errors with details
  static withDetails(validationErrors: any[]) {
    const details = validationErrors.map((error) => ({
      field: error.property,
      constraints: error.constraints,
      value: error.value,
    }));

    return new ValidationException(ErrorCode.VALIDATION_ERROR, details);
  }
}
