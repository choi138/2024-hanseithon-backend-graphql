import { InputType } from '@nestjs/graphql';

import { CreateTeamMemberDto } from './create-team-member.dto';

@InputType({ description: '팀 포지션 변경 DTO' })
export class UpdateTeamPositionDto extends CreateTeamMemberDto {}
