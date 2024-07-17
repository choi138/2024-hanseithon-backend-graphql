// position
// name
// createdAt
// grade
// department
// teamName

import { Field, IntersectionType, ObjectType, PickType } from '@nestjs/graphql';

import { TeamMemberDto, TeamMemberStudentDto } from './team-output.dto';

@ObjectType({ description: '팀 멤버 정보' })
export class TeamMemberOutputDto extends IntersectionType(
  PickType(TeamMemberDto, ['position', 'name', 'createdAt']),
  TeamMemberStudentDto,
) {
  @Field(() => String, { description: '팀 이름' })
  teamName: string;
}
