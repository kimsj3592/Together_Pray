import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../constants/error-codes';

/**
 * Business logic exception
 * Used for domain-specific errors (e.g., already prayed today, not a member)
 */
export class BusinessException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCode,
    public readonly details?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        code: errorCode,
        message: ErrorMessages[errorCode],
        details,
      },
      statusCode,
    );
  }

  // Convenience factory methods for common business errors
  static alreadyPrayed() {
    return new BusinessException(
      ErrorCode.PRAYER_ALREADY_PRAYED,
      null,
      HttpStatus.CONFLICT,
    );
  }

  static notGroupMember(groupId: string) {
    return new BusinessException(
      ErrorCode.GROUP_NOT_MEMBER,
      { groupId },
      HttpStatus.FORBIDDEN,
    );
  }

  static notAuthor() {
    return new BusinessException(
      ErrorCode.PRAYER_NOT_AUTHOR,
      null,
      HttpStatus.FORBIDDEN,
    );
  }

  static groupNotFound(groupId: string) {
    return new BusinessException(
      ErrorCode.GROUP_NOT_FOUND,
      { groupId },
      HttpStatus.NOT_FOUND,
    );
  }

  static prayerNotFound(prayerId: string) {
    return new BusinessException(
      ErrorCode.PRAYER_NOT_FOUND,
      { prayerId },
      HttpStatus.NOT_FOUND,
    );
  }

  static invalidCredentials() {
    return new BusinessException(
      ErrorCode.AUTH_INVALID_CREDENTIALS,
      null,
      HttpStatus.UNAUTHORIZED,
    );
  }

  static emailExists(email: string) {
    return new BusinessException(
      ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
      { email },
      HttpStatus.CONFLICT,
    );
  }

  static adminRequired() {
    return new BusinessException(
      ErrorCode.GROUP_ADMIN_REQUIRED,
      null,
      HttpStatus.FORBIDDEN,
    );
  }
}
