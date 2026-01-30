import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  @IsNotEmpty({ message: '이메일은 필수입니다' })
  email: string;

  @ApiProperty({
    description: '비밀번호 (8-100자)',
    example: 'password123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수입니다' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  @MaxLength(100, { message: '비밀번호는 최대 100자까지 가능합니다' })
  password: string;

  @ApiProperty({
    description: '사용자 이름 (2-100자)',
    example: '홍길동',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수입니다' })
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(100, { message: '이름은 최대 100자까지 가능합니다' })
  name: string;
}
