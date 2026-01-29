import { IsString, IsNotEmpty, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreatePrayerItemDto {
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: '제목은 2자 이상이어야 합니다' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: '내용은 5자 이상이어야 합니다' })
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
