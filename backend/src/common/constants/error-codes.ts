/**
 * Error codes for Together Pray API
 */
export enum ErrorCode {
  // Authentication Errors (AUTH001-AUTH099)
  AUTH_INVALID_CREDENTIALS = 'AUTH001',
  AUTH_TOKEN_EXPIRED = 'AUTH002',
  AUTH_TOKEN_INVALID = 'AUTH003',
  AUTH_UNAUTHORIZED = 'AUTH004',
  AUTH_EMAIL_ALREADY_EXISTS = 'AUTH005',

  // Group Errors (GROUP001-GROUP099)
  GROUP_NOT_FOUND = 'GROUP001',
  GROUP_ALREADY_MEMBER = 'GROUP002',
  GROUP_NOT_MEMBER = 'GROUP003',
  GROUP_INVALID_INVITE = 'GROUP004',
  GROUP_ADMIN_REQUIRED = 'GROUP005',

  // Prayer Errors (PRAYER001-PRAYER099)
  PRAYER_NOT_FOUND = 'PRAYER001',
  PRAYER_ALREADY_PRAYED = 'PRAYER002',
  PRAYER_NOT_AUTHOR = 'PRAYER003',
  PRAYER_INVALID_STATUS = 'PRAYER004',
  PRAYER_UPDATE_FAILED = 'PRAYER005',

  // User Errors (USER001-USER099)
  USER_NOT_FOUND = 'USER001',
  USER_INVALID_DATA = 'USER002',

  // Validation Errors (VAL001-VAL099)
  VALIDATION_ERROR = 'VAL001',
  VALIDATION_REQUIRED_FIELD = 'VAL002',
  VALIDATION_INVALID_FORMAT = 'VAL003',
  VALIDATION_OUT_OF_RANGE = 'VAL004',

  // General Errors (INT001-INT099)
  INTERNAL_ERROR = 'INT001',
  NOT_FOUND = 'INT002',
  BAD_REQUEST = 'INT003',
  FORBIDDEN = 'INT004',
  CONFLICT = 'INT005',
}

/**
 * Error messages for each error code
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  // Auth
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: '토큰이 만료되었습니다',
  [ErrorCode.AUTH_TOKEN_INVALID]: '유효하지 않은 토큰입니다',
  [ErrorCode.AUTH_UNAUTHORIZED]: '인증이 필요합니다',
  [ErrorCode.AUTH_EMAIL_ALREADY_EXISTS]: '이미 사용 중인 이메일입니다',

  // Group
  [ErrorCode.GROUP_NOT_FOUND]: '그룹을 찾을 수 없습니다',
  [ErrorCode.GROUP_ALREADY_MEMBER]: '이미 그룹의 멤버입니다',
  [ErrorCode.GROUP_NOT_MEMBER]: '그룹의 멤버가 아닙니다',
  [ErrorCode.GROUP_INVALID_INVITE]: '유효하지 않은 초대 링크입니다',
  [ErrorCode.GROUP_ADMIN_REQUIRED]: '관리자 권한이 필요합니다',

  // Prayer
  [ErrorCode.PRAYER_NOT_FOUND]: '기도 제목을 찾을 수 없습니다',
  [ErrorCode.PRAYER_ALREADY_PRAYED]: '오늘 이미 기도했습니다',
  [ErrorCode.PRAYER_NOT_AUTHOR]: '작성자만 수정/삭제할 수 있습니다',
  [ErrorCode.PRAYER_INVALID_STATUS]: '유효하지 않은 기도 상태입니다',
  [ErrorCode.PRAYER_UPDATE_FAILED]: '기도 제목 업데이트에 실패했습니다',

  // User
  [ErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다',
  [ErrorCode.USER_INVALID_DATA]: '유효하지 않은 사용자 데이터입니다',

  // Validation
  [ErrorCode.VALIDATION_ERROR]: '입력 데이터 검증에 실패했습니다',
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: '필수 항목이 누락되었습니다',
  [ErrorCode.VALIDATION_INVALID_FORMAT]: '입력 형식이 올바르지 않습니다',
  [ErrorCode.VALIDATION_OUT_OF_RANGE]: '입력 범위를 벗어났습니다',

  // General
  [ErrorCode.INTERNAL_ERROR]: '서버 오류가 발생했습니다',
  [ErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다',
  [ErrorCode.BAD_REQUEST]: '잘못된 요청입니다',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다',
  [ErrorCode.CONFLICT]: '리소스 충돌이 발생했습니다',
};
