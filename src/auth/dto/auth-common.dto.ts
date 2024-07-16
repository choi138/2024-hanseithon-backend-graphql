import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from 'src/common/constant';

@InputType({ description: '인증 공통 정보' })
export class AuthCommonDto {
  @Field(() => String, { description: '사용자 아이디' })
  @IsString({ message: '이메일 입력은 필수에요.' })
  @IsEmail({}, { message: '올바른 이메일을 입력해주세요.' })
  readonly email: string;

  @Field(() => String, { description: '사용자 비밀번호' })
  @IsNotEmpty({ message: '비밀번호 입력은 필수에요.' })
  @IsString({ message: '올바른 비밀번호를 입력해주세요.' })
  @Matches(PASSWORD_REGEX, {
    message: '비밀번호는 8자 이상, 숫자 + 특수기호 조합이어야 해요.',
  })
  readonly password: string;
}
