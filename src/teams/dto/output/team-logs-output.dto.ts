import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamLogType } from '@prisma/client';

registerEnumType(TeamLogType, { name: 'TeamLogType' });

@ObjectType({ description: '팀 로그 정보' })
export class TeamLogsOutputDto {
  @Field({ description: '로그 ID' })
  id: string;

  @Field(() => TeamLogType, { description: '로그 타입' })
  type: TeamLogType;

  @Field({ description: '팀 ID' })
  teamId: string;

  @Field({ description: '멤버 이름' })
  memberName: string;

  @Field({ description: '로그 시간' })
  actionAt: Date;
}
