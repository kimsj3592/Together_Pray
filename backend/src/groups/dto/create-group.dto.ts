import { IsString, IsOptional, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: '그룹 이름 (2-100자)',
    example: '새벽기도 모임',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '그룹 이름은 필수입니다' })
  @MinLength(2, { message: '그룹 이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(100, { message: '그룹 이름은 최대 100자까지 가능합니다' })
  name: string;

  @ApiProperty({
    description: '그룹 설명 (선택, 최대 500자)',
    example: '매일 새벽 5시에 함께 기도하는 모임입니다',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: '그룹 설명은 최대 500자까지 가능합니다' })
  description?: string;
}
