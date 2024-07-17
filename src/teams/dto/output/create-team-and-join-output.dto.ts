import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamMemberPosition } from '@prisma/client';

import { TeamModel } from 'src/common/models';

registerEnumType(TeamMemberPosition, { name: 'TeamMemberPosition' });

@ObjectType({ description: '학생 정보 DTO' })
export class CreateTeamAndJoinStudentInfo {
  @Field(() => String, { description: '학과' })
  department: string;

  @Field(() => Number, { description: '학년' })
  grade: number;
}

@ObjectType({ description: '팀 멤버 DTO' })
export class CreateTeamAndJoinTeamMember {
  @Field(() => Boolean, { description: '팀장 여부' })
  isLeader: boolean;

  @Field(() => TeamMemberPosition, { description: '포지션' })
  position: TeamMemberPosition;

  @Field(() => String, { description: '이름' })
  name: string;

  @Field(() => CreateTeamAndJoinStudentInfo, { description: '학생 정보' })
  student: CreateTeamAndJoinStudentInfo;

  @Field(() => Date, { description: '팀 멤버 생성일' })
  createdAt: Date;
}

@ObjectType({ description: '팀 생성 및 가입 결과 DTO' })
export class CreateTeamAndJoinOutputDto extends TeamModel {
  @Field(() => [CreateTeamAndJoinTeamMember], { description: '팀 멤버' })
  members: CreateTeamAndJoinTeamMember[];
}
