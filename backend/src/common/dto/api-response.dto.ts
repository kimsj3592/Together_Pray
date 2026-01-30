import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination metadata
 */
export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages: number;
}

/**
 * Standard success response wrapper
 */
export class ApiResponse<T> {
  @ApiProperty({ description: 'Success status', example: true })
  success: true;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({
    description: 'Pagination metadata (optional)',
    type: PaginationMeta,
    required: false,
  })
  meta?: PaginationMeta;
}

/**
 * Error detail object
 */
export class ApiErrorDetail {
  @ApiProperty({ description: 'Error code', example: 'AUTH001' })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: '이메일 또는 비밀번호가 올바르지 않습니다',
  })
  message: string;

  @ApiProperty({
    description: 'Additional error details',
    required: false,
    example: { field: 'email', constraint: 'isEmail' },
  })
  details?: any;
}

/**
 * Standard error response
 */
export class ApiErrorResponse {
  @ApiProperty({ description: 'Success status', example: false })
  success: false;

  @ApiProperty({ description: 'Error details', type: ApiErrorDetail })
  error: ApiErrorDetail;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2026-01-30T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ description: 'Request path', example: '/api/auth/login' })
  path: string;
}
