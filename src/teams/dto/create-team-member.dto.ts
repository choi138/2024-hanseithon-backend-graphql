import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { TeamMemberPosition } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

registerEnumType(TeamMemberPosition, { name: 'TeamMemberPosition' });

@InputType({ description: '팀 멤버 생성 DTO' })
export class CreateTeamMemberDto {
  @Field(() => TeamMemberPosition, { description: '팀 멤버 포지션' })
  @IsNotEmpty({ message: '올바른 포지션을 선택해주세요' })
  @IsEnum(TeamMemberPosition, { message: '올바른 포지션을 선택해주세요' })
  readonly position: TeamMemberPosition;
}
