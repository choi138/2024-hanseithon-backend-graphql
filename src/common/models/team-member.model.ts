import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamMemberPosition } from '@prisma/client';

registerEnumType(TeamMemberPosition, { name: 'TeamMemberPosition' });

@ObjectType({ description: '팀 멤버' })
export class TeamMemberModel {
  @Field(() => Date, { description: '팀 멤버 생성일' })
  createdAt: Date;

  @Field(() => Boolean, { description: '팀 리더 여부' })
  isLeader: boolean;

  @Field(() => String, { description: '팀 아이디' })
  teamId: string;

  @Field(() => TeamMemberPosition, { description: '팀 멤버 포지션' })
  position: TeamMemberPosition;
}
