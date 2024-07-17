import { IntersectionType } from '@nestjs/swagger';

import { CreateTeamMemberDto } from './create-team-member.dto';
import { CreateTeamDto } from './create-team.dto';

export class CreateTeamAndJoinDto extends IntersectionType(CreateTeamDto, CreateTeamMemberDto) {}
// IntersectionType은 Dto들을 합쳐서 하나의 Dto로 만들어줌
