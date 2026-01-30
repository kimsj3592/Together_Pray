import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrayerUpdateDto {
  @ApiProperty({
    description: '업데이트 내용 (5-2000자)',
    example: '오늘 병원 검사 결과 많이 호전되었습니다. 감사합니다!',
    minLength: 5,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty({ message: '업데이트 내용은 필수입니다' })
  @MinLength(5, { message: '업데이트 내용은 5자 이상이어야 합니다' })
  @MaxLength(2000, { message: '업데이트 내용은 최대 2000자까지 가능합니다' })
  content: string;
}
