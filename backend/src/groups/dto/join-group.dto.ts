import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupDto {
  @ApiProperty({
    description: '그룹 초대 코드',
    example: 'ABC123XYZ',
  })
  @IsString()
  @IsNotEmpty({ message: '초대 코드는 필수입니다' })
  inviteCode: string;
}
