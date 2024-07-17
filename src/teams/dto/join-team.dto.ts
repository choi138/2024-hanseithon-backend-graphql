import { Field, InputType } from '@nestjs/graphql';

import { CreateTeamMemberDto } from './create-team-member.dto';

@InputType({ description: '팀 가입 DTO' })
export class JoinTeamDto extends CreateTeamMemberDto {
  @Field({ description: '초대 코드' })
  readonly inviteCode: string;
}
