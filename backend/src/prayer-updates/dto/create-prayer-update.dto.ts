import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePrayerUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: '업데이트 내용은 5자 이상이어야 합니다' })
  content: string;
}
