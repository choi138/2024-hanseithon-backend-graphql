import { TeamMemberPosition } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTeamMemberDto {
  @IsNotEmpty({ message: '올바른 포지션을 선택해주세요' })
  @IsEnum(TeamMemberPosition, { message: '올바른 포지션을 선택해주세요' })
  readonly position: TeamMemberPosition;
}
