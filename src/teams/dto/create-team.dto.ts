import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { TeamType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

registerEnumType(TeamType, { name: 'TeamType' });

@InputType({ description: '팀 생성 DTO' })
export class CreateTeamDto {
  @Field(() => String, { description: '팀명' })
  @IsNotEmpty({ message: '올바른 팀 타입을 입력해주세요.' })
  @IsString({ message: '올바른 팀명을 입력해주세요.' })
  @MinLength(2, { message: '팀명은 최소 2글자, 최대 30글자까지 입력할 수 있어요.' })
  @MaxLength(30, { message: '팀명은 최소 2글자, 최대 30글자까지 입력할 수 있어요.' })
  readonly name: string;

  @Field(() => String, { description: '팀 설명' })
  @IsNotEmpty({ message: '올바른 팀 설명을 입력해주세요.' })
  readonly description?: string;

  @Field(() => TeamType, { description: '팀 유형' })
  @IsNotEmpty({ message: '올바른 팀 유형을 입력해주세요.' })
  @IsEnum(TeamType, { message: '올바른 팀 유형을 입력해주세요.' })
  readonly type: TeamType;
}
