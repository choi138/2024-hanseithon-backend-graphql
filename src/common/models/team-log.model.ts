import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamLogType } from '@prisma/client';

registerEnumType(TeamLogType, { name: 'StudentDepartment' });

@ObjectType({ description: '팀 로그' })
export class TeamLogModel {
  @Field(() => String, { description: '팀 로그 id' })
  id: string;

  @Field(() => TeamLogType, { description: '팀 로그 타입' })
  readonly type: TeamLogType;

  @Field(() => String, { description: '팀 아이디' })
  readonly teamId: string;

  @Field(() => String, { description: '팀 멤버 이름' })
  readonly memberName: string;

  @Field(() => Date, { description: '팀 로그 활동 시간' })
  actionAt: Date;
}
