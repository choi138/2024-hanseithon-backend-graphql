import { InputType } from '@nestjs/graphql';

import { AuthCommonDto } from './auth-common.dto';

@InputType({ description: '로그인 정보' })
export class SignInDto extends AuthCommonDto {}
