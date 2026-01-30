import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '생성 일시', example: '2026-01-30T12:00:00.000Z' })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: '사용자 정보', type: UserResponseDto })
  user: UserResponseDto;
}

export class ProfileResponseDto {
  @ApiProperty({ description: '사용자 정보', type: UserResponseDto })
  user: UserResponseDto;
}
