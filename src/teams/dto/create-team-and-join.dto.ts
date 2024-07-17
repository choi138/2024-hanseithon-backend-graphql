import { InputType, IntersectionType } from '@nestjs/graphql';

import { TeamModel } from 'src/common/models';

import { CreateTeamMemberDto } from './create-team-member.dto';
import { CreateTeamDto } from './create-team.dto';

@InputType({ description: '팀 생성 및 가입 DTO' })
export class CreateTeamAndJoinDto extends IntersectionType(CreateTeamDto, CreateTeamMemberDto) {}
// IntersectionType은 Dto들을 합쳐서 하나의 Dto로 만들어줌
