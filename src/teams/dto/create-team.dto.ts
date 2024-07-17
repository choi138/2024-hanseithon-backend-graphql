import { TeamType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty({ message: '올바른 팀 타입을 입력해주세요.' })
  @IsString({ message: '올바른 팀명을 입력해주세요.' })
  @MinLength(2, { message: '팀명은 최소 2글자, 최대 30글자까지 입력할 수 있어요.' })
  @MaxLength(30, { message: '팀명은 최소 2글자, 최대 30글자까지 입력할 수 있어요.' })
  readonly name: string;

  @IsNotEmpty({ message: '올바른 팀 설명을 입력해주세요.' })
  readonly description?: string;

  @IsNotEmpty({ message: '올바른 팀 유형을 입력해주세요.' })
  @IsEnum(TeamType, { message: '올바른 팀 유형을 입력해주세요.' })
  readonly type: TeamType;
}
