import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamType } from '@prisma/client';

import { TeamMemberModel } from './team-member.model';

registerEnumType(TeamType, { name: 'StudentDepartment' });

@ObjectType({ description: '팀' })
export class TeamModel {
  @Field(() => String, { description: '팀 id' })
  id: string;

  @Field(() => Date, { description: '팀 생성일' })
  readonly createdAt: Date;

  @Field(() => Date, { description: '팀 업데이트 시간' })
  updatedAt: Date;

  @Field(() => TeamType, { description: '팀 타입' })
  readonly type: TeamType;

  @Field(() => String, { description: '팀 이름' })
  readonly name: string;

  @Field(() => String, { description: '팀 설명' })
  readonly description: string;

  @Field(() => String, { description: '초대 코드' })
  inviteCode: string;

  @Field(() => [TeamMemberModel], { description: '팀 멤버' })
  members: TeamMemberModel[];
}
